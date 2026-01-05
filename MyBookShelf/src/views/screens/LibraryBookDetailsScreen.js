// src/views/screens/LibraryBookDetailsScreen.js - COMPLETO
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addBook, getBookByIsbn, addBookToList, updateBook } from '../../services/restDbApi';

const LibraryBookDetailsScreen = ({ route, navigation }) => {
  const { book: initialBook, fromList, listId, listName, isNewBook, viewOnly } = route?.params || {};
  const [book, setBook] = useState(initialBook);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialBook?.isFavorite || false);

  const isFromList = fromList === true && listId && isNewBook === true;
  const isViewOnly = viewOnly === true || (fromList === true && !isNewBook);

  const handleMainAction = async () => {
    if (isFromList) {
      try {
        setLoading(true);
        console.log('\n🔵 Iniciando adição do livro à lista...');

        let existingBook = null;
        if (book.isbn) {
          existingBook = await getBookByIsbn(book.isbn);
        }

        let bookToAdd;

        if (existingBook) {
          bookToAdd = existingBook;
          console.log('✅ Usando livro existente, ID:', existingBook._id);
        } else {
          console.log('➕ Adicionando livro à RestDB...');
          const newBook = await addBook({
            ...book,
            status: 'wishlist',
          });
          bookToAdd = newBook;
          console.log('✅ Livro adicionado à RestDB, ID:', newBook._id);
        }

        await addBookToList(listId, bookToAdd._id);
        
        Alert.alert(
          'Sucesso!',
          `"${book.title}" foi adicionado à lista "${listName}"!`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        console.error('❌ Erro ao adicionar livro:', error);
        
        let errorMessage = 'Não foi possível adicionar o livro à lista';
        
        if (error.message?.includes('já está')) {
          errorMessage = 'Este livro já está nesta lista!';
        }
        
        Alert.alert('Erro', errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        if (book.status === 'read') {
          Alert.alert(
            '📖 Reler Livro',
            `Você já terminou "${book.title}". Deseja ler novamente?`,
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Sim, Reler',
                onPress: async () => {
                  try {
                    await updateBook(book._id, { 
                      status: 'reading', 
                      current_page: 0,
                      currentPage: 0,
                      progress: 0,
                      finished_date: null,
                    });
                    
                    Alert.alert(
                      '✅ Livro Reiniciado!',
                      'O livro foi movido para "A Ler" e o progresso foi resetado.',
                      [
                        {
                          text: 'Ir para A Ler',
                          onPress: () => navigation.navigate('ReadingBooks'),
                        },
                        { text: 'OK' },
                      ]
                    );
                  } catch (error) {
                    console.error('Erro ao reiniciar livro:', error);
                    Alert.alert('Erro', 'Não foi possível reiniciar o livro.');
                  }
                },
              },
            ]
          );
          return;
        }

        if (book.status === 'reading') {
          Alert.alert(
            '📖 Livro em Leitura',
            `"${book.title}" já está na sua lista de livros em leitura.`,
            [
              {
                text: 'Ver Lista',
                onPress: () => navigation.navigate('ReadingBooks'),
              },
              { text: 'OK', style: 'cancel' },
            ]
          );
          return;
        }

        await updateBook(book._id, { 
          status: 'reading', 
          current_page: 0,
          currentPage: 0,
          progress: 0 
        });
        
        Alert.alert(
          '✅ Adicionado!',
          `"${book.title}" foi adicionado aos livros em leitura.`,
          [
            {
              text: 'Ver Lista',
              onPress: () => navigation.navigate('ReadingBooks'),
            },
            { text: 'OK' },
          ]
        );
      } catch (error) {
        console.error('Erro:', error);
        Alert.alert('Erro', 'Não foi possível iniciar a leitura.');
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const newFavoriteStatus = !isFavorite;
      await updateBook(book._id, { isFavorite: newFavoriteStatus });
      setIsFavorite(newFavoriteStatus);
      setBook({ ...book, isFavorite: newFavoriteStatus });
      
      Alert.alert(
        newFavoriteStatus ? '❤️ Favorito!' : '💔 Removido',
        newFavoriteStatus ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.'
      );
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos.');
    }
  };

  const getLanguage = () => {
    if (!book?.language) return 'PT';
    if (typeof book.language === 'string') return book.language.toUpperCase();
    return 'PT';
  };

  const getYear = () => {
    if (book?.publishedDate) {
      return new Date(book.publishedDate).getFullYear();
    }
    if (book?.publishYear) return book.publishYear;
    return 'N/A';
  };

  const getPublisher = () => {
    return book?.publisher || 'N/A';
  };

  const getISBN = () => {
    return book?.isbn || book?.isbn13 || book?.isbn10 || 'N/A';
  };

  const getAgeRating = () => {
    return book?.ageRating || book?.maturityRating || 'Todos';
  };

  const getFormat = () => {
    return book?.format || book?.printType || 'Físico';
  };

  const getEdition = () => {
    return book?.edition || 'N/A';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />

      {}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        {}
        {!isFromList && (
          <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
            <Icon 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={26} 
              color={isFavorite ? "#E91E63" : "#2C3E50"} 
            />
          </TouchableOpacity>
        )}
        {isFromList && <View style={styles.headerSpace} />}
      </View>

      {isFromList && (
        <View style={styles.listBanner}>
          <Icon name="playlist-plus" size={20} color="#7B1FA2" />
          <Text style={styles.listBannerText}>
            Adicionar à lista: <Text style={styles.listBannerName}>{listName}</Text>
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.bookCard}>
          <View style={styles.decorativeCircleLarge} />
          <View style={styles.decorativeCircleMedium} />

          <View style={styles.bookCardContent}>
            <View style={styles.coverContainer}>
              <Image
                source={{ uri: book?.coverUrl || book?.cover || 'https://via.placeholder.com/105x158' }}
                style={styles.bookCover}
                resizeMode="cover"
              />
              <View style={styles.coverGloss} />
            </View>

            <View style={styles.bookInfo}>
              <View style={styles.badgeContainer}>
                <Icon name="book-open-variant" size={14} color="#2A5288" />
                <Text style={styles.badgeText}>
                  {isFromList ? 'Para adicionar' : 'Na tua biblioteca'}
                </Text>
              </View>
              
              <Text style={styles.bookTitle} numberOfLines={3}>
                {book?.title || 'Sem título'}
              </Text>
              
              <Text style={styles.bookAuthor} numberOfLines={2}>
                {book?.author || book?.authors?.join(', ') || 'Autor desconhecido'}
              </Text>
            </View>
          </View>
        </View>

        {}
        <View style={styles.infoCardsRow}>
          <View style={styles.infoCard}>
            <Icon name="book-open-page-variant" size={20} color="#2A5288" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>PÁGINAS</Text>
            <Text style={styles.infoValue}>
              {book?.pageCount || book?.pages || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="web" size={20} color="#2A5288" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>IDIOMA</Text>
            <Text style={styles.infoValue}>{getLanguage()}</Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="calendar" size={20} color="#2A5288" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>ANO</Text>
            <Text style={styles.infoValue}>{getYear()}</Text>
          </View>
        </View>

        {}
        <View style={styles.infoCardsRow}>
          <View style={styles.infoCard}>
            <Icon name="office-building" size={20} color="#2A5288" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>EDITORA</Text>
            <Text style={[styles.infoValue, styles.smallerText]} numberOfLines={2}>
              {getPublisher()}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="bookmark" size={20} color="#2A5288" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>FORMATO</Text>
            <Text style={styles.infoValue}>{getFormat()}</Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="numeric" size={20} color="#2A5288" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>EDIÇÃO</Text>
            <Text style={styles.infoValue}>{getEdition()}</Text>
          </View>
        </View>

        {}
        <View style={styles.infoCardsRow}>
          <View style={styles.infoCardWide}>
            <Icon name="barcode" size={20} color="#2A5288" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>ISBN</Text>
            <Text style={[styles.infoValue, styles.smallerText]} numberOfLines={1}>
              {getISBN()}
            </Text>
          </View>

          <View style={styles.infoCardWide}>
            <Icon name="account-check" size={20} color="#2A5288" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>CLASS. ETÁRIA</Text>
            <Text style={styles.infoValue}>{getAgeRating()}</Text>
          </View>
        </View>

        {book?.description && (
          <View style={styles.descriptionCard}>
            <View style={styles.cardHeader}>
              <Icon name="text-box" size={22} color="#2A5288" />
              <Text style={styles.descriptionTitle}>Sobre o Livro</Text>
            </View>
            <Text style={styles.descriptionText}>{book.description}</Text>
          </View>
        )}

        {book?.categories && Array.isArray(book.categories) && book.categories.length > 0 && (
          <View style={styles.categoriesCard}>
            <View style={styles.cardHeader}>
              <Icon name="tag-multiple" size={22} color="#2A5288" />
              <Text style={styles.categoriesTitle}>Categorias</Text>
            </View>
            <View style={styles.categoriesContainer}>
              {book.categories.map((category, index) => (
                <View key={index} style={styles.categoryChip}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {}
        {!isViewOnly && (
          <TouchableOpacity
            style={[
              styles.mainButton,
              isFromList && styles.addToListButton,
              loading && styles.mainButtonDisabled,
            ]}
            onPress={handleMainAction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Icon
                name={isFromList ? 'playlist-plus' : book.status === 'read' ? 'book-refresh' : 'book-open-page-variant'}
                size={24}
                color="#FFFFFF"
              />
            )}
            <Text style={styles.mainButtonText}>
              {loading 
                ? 'A adicionar...' 
                : isFromList 
                  ? 'Guardar na Lista' 
                  : book.status === 'read'
                    ? 'Reler Livro'
                    : 'Começar a Ler'
              }
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8D5A8',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#E8D5A8',
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  headerSpace: {
    width: 48,
    height: 48,
  },
  listBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#7B1FA2',
  },
  listBannerText: {
    fontSize: 14,
    color: '#4A148C',
    marginLeft: 8,
  },
  listBannerName: {
    fontWeight: 'bold',
    color: '#7B1FA2',
  },
  bookCard: {
    backgroundColor: '#2A5288',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#2A5288',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  decorativeCircleLarge: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeCircleMedium: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  bookCardContent: {
    flexDirection: 'row',
    padding: 18,
  },
  coverContainer: {
    position: 'relative',
  },
  bookCover: {
    width: 105,
    height: 158,
    borderRadius: 14,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  coverGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: '600',
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 28,
  },
  bookAuthor: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
  infoCardsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 14,
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  infoCardWide: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  infoIcon: {
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#808080',
    marginBottom: 6,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A5288',
    textAlign: 'center',
  },
  smallerText: {
    fontSize: 13,
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  descriptionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 22,
    textAlign: 'justify',
  },
  categoriesCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoriesTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#E8F0F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A5288',
  },
  categoryText: {
    fontSize: 13,
    color: '#2A5288',
    fontWeight: '500',
  },
  mainButton: {
    flexDirection: 'row',
    backgroundColor: '#2A5288',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#2A5288',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    gap: 10,
  },
  addToListButton: {
    backgroundColor: '#7B1FA2',
    shadowColor: '#7B1FA2',
  },
  mainButtonDisabled: {
    opacity: 0.6,
  },
  mainButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default LibraryBookDetailsScreen;