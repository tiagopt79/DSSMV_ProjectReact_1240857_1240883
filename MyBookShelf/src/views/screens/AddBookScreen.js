import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { searchByISBN } from '../../services/googleBooksApi';
import { addBook } from '../../services/restDbApi';
import colors from '../../theme/colors';

const AddBookScreen = ({ navigation }) => {
  const [isbn, setIsbn] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookPreview, setBookPreview] = useState(null);

  const handleSearchISBN = async () => {
    if (!isbn.trim()) {
      Alert.alert('Erro', 'Por favor, insira um ISBN válido');
      return;
    }

    setLoading(true);
    try {
      const book = await searchByISBN(isbn);
      setBookPreview(book);
    } catch (error) {
      Alert.alert('Erro', 'Livro não encontrado. Verifique o ISBN.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async () => {
    if (!bookPreview) return;

    setLoading(true);
    try {
      await addBook({
        ...bookPreview,
        status: 'wishlist',
        currentPage: 0,
        isFavorite: false,
        dateAdded: new Date().toISOString(),
      });
      
      Alert.alert(
        'Sucesso! 🎉',
        'Livro adicionado à sua biblioteca',
        [
          {
            text: 'Ver Biblioteca',
            onPress: () => navigation.navigate('MyLibrary'),
          },
          {
            text: 'Adicionar Outro',
            onPress: () => {
              setIsbn('');
              setBookPreview(null);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o livro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Adicionar Livro</Text>
          <Text style={styles.subtitle}>
            Digite o ISBN do livro para adicionar à sua biblioteca
          </Text>
        </View>

        {}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ISBN (ex: 9780123456789)"
            value={isbn}
            onChangeText={setIsbn}
            keyboardType="numeric"
            maxLength={13}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchISBN}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.searchButtonText}>🔍 Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        {}
        {bookPreview && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview:</Text>
            
            <View style={styles.previewCard}>
              {bookPreview.coverUrl && (
                <Image
                  source={{ uri: bookPreview.coverUrl }}
                  style={styles.previewCover}
                  resizeMode="cover"
                />
              )}
              
              <View style={styles.previewInfo}>
                <Text style={styles.previewBookTitle} numberOfLines={2}>
                  {bookPreview.title}
                </Text>
                <Text style={styles.previewAuthor}>{bookPreview.author}</Text>
                
                {bookPreview.publishYear && (
                  <Text style={styles.previewDetail}>
                    Ano: {bookPreview.publishYear}
                  </Text>
                )}
                
                {bookPreview.pages && (
                  <Text style={styles.previewDetail}>
                    Páginas: {bookPreview.pages}
                  </Text>
                )}

                {bookPreview.publisher && (
                  <Text style={styles.previewDetail}>
                    Editora: {bookPreview.publisher}
                  </Text>
                )}
              </View>
            </View>

            {}
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddBook}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.addButtonText}>
                  ➕ Adicionar à Biblioteca
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {}
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 Dica:</Text>
          <Text style={styles.tipText}>
            O ISBN geralmente está na parte de trás do livro, perto do código de barras.
            Pode ter 10 ou 13 dígitos.
          </Text>
        </View>

        {}
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.manualButtonText}>
            🔍 Ou buscar por título
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    elevation: 2,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  previewInfo: {
    flex: 1,
  },
  previewBookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  previewAuthor: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  previewDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  tipContainer: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  manualButton: {
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  manualButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddBookScreen;