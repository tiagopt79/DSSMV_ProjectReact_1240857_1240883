// src/views/screens/BookDetailsScreen.js - VERSÃO MELHORADA

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { addBook, getBookByIsbn, updateBook } from '../../services/restDbApi';

const BookDetailsScreen = ({ route, navigation }) => {
  const { book: initialBook } = route.params;
  const [book, setBook] = useState(initialBook);
  const [loading, setLoading] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [libraryBookId, setLibraryBookId] = useState(null);

  useEffect(() => {
    checkIfInLibrary();
  }, []);

  const checkIfInLibrary = async () => {
    try {
      const isbn = book.isbn || book.isbn_13?.[0] || book.key?.split('/').pop();
      
      if (!isbn) return;

      const existingBook = await getBookByIsbn(isbn);
      
      if (existingBook) {
        setIsInLibrary(true);
        setLibraryBookId(existingBook._id);
        setBook({ ...book, ...existingBook });
      } else {
        setIsInLibrary(false);
      }
    } catch (error) {
      console.error('Erro ao verificar biblioteca:', error);
    }
  };

  const addToLibrary = async (status, message, navigateTo) => {
    try {
      setLoading(true);

      const isbn = book.isbn || book.isbn_13?.[0] || book.key?.split('/').pop() || `temp_${Date.now()}`;

      const bookData = {
        isbn: isbn,
        title: book.title || 'Sem título',
        author: book.author || book.author_name?.[0] || 'Autor desconhecido',
        cover: book.cover || book.coverUrl || 
               (book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : ''),
        description: book.description?.value || book.description || '',
        publishYear: book.publish_year?.[0] || book.first_publish_year || '',
        pages: book.number_of_pages_median || book.pages || 0,
        rating: book.rating || 0,
        status: status,
        isFavorite: book.isFavorite || false,
        current_page: 0,
        progress: 0,
        notes: '',
        categories: Array.isArray(book.subject) ? book.subject.join(', ') : '',
        language: book.language?.[0] || 'pt',
        publisher: book.publisher?.[0] || '',
      };

      if (isInLibrary && libraryBookId) {
        const updated = await updateBook(libraryBookId, { status });
        setBook({ ...book, status });
      } else {
        const newBook = await addBook(bookData);
        setIsInLibrary(true);
        setLibraryBookId(newBook._id);
        setBook({ ...book, ...newBook });
      }

      Alert.alert('Sucesso!', message);
      setLoading(false);

      if (navigateTo) {
        setTimeout(() => {
          navigation.navigate(navigateTo);
        }, 500);
      }

    } catch (error) {
      console.error('Erro ao adicionar:', error);
      Alert.alert('Erro', `Não foi possível adicionar o livro.\n\n${error.message}`);
      setLoading(false);
    }
  };

  const handleStartReading = async () => {
    await addToLibrary('reading', 'Livro adicionado a "A Ler"!', 'ReadingBooks');
  };

  const handleAddToWishlist = async () => {
    await addToLibrary('wishlist', 'Livro adicionado à Wishlist!', null);
  };

  const handleAddToMyLibrary = async () => {
    await addToLibrary('read', 'Livro adicionado à Biblioteca!', null);
  };

  const handleToggleFavorite = async () => {
    try {
      
      if (!isInLibrary) {
        const isbn = book.isbn || book.isbn_13?.[0] || book.key?.split('/').pop() || `temp_${Date.now()}`;
        
        const bookData = {
          isbn: isbn,
          title: book.title || 'Sem título',
          author: book.author || book.author_name?.[0] || 'Autor desconhecido',
          cover: book.cover || book.coverUrl || 
                 (book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : ''),
          description: book.description?.value || book.description || '',
          publishYear: book.publish_year?.[0] || book.first_publish_year || '',
          pages: book.number_of_pages_median || book.pages || 0,
          rating: book.rating || 0,
          status: 'toRead',
          isFavorite: true,
          current_page: 0,
          progress: 0,
          notes: '',
          categories: Array.isArray(book.subject) ? book.subject.join(', ') : '',
          language: book.language?.[0] || 'pt',
          publisher: book.publisher?.[0] || '',
        };

        setLoading(true);
        const newBook = await addBook(bookData);
        
        setIsInLibrary(true);
        setLibraryBookId(newBook._id);
        setBook({ ...book, isFavorite: true, ...newBook });
        Alert.alert('Sucesso!', 'Livro adicionado aos Favoritos!');
        setLoading(false);

      } else {
        const newFavoriteStatus = !book.isFavorite;
        
        setLoading(true);
        const updated = await updateBook(libraryBookId, { isFavorite: newFavoriteStatus });
        
        setBook({ ...book, isFavorite: newFavoriteStatus });
        Alert.alert(
          newFavoriteStatus ? 'Adicionado!' : 'Removido',
          newFavoriteStatus ? 'Livro adicionado aos Favoritos!' : 'Livro removido dos Favoritos'
        );
        setLoading(false);
      }

    } catch (error) {
      console.error('Erro ao toggle favorito:', error);
      Alert.alert('Erro', `Não foi possível atualizar favorito.\n${error.message}`);
      setLoading(false);
    }
  };

  const coverUrl = book.cover || book.coverUrl || 
                   (book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={26} color="#2A5288" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* TÍTULO */}
        <Text style={styles.pageTitle}>Detalhes do Livro</Text>

        {/* CARD PRINCIPAL COM CAPA E INFO */}
        <View style={styles.mainCard}>
          {/* CAPA */}
          <View style={styles.coverContainer}>
            {coverUrl ? (
              <Image source={{ uri: coverUrl }} style={styles.cover} />
            ) : (
              <View style={styles.noCover}>
                <MaterialIcons name="menu-book" size={50} color="#CCC" />
              </View>
            )}
          </View>

          {/* INFORMAÇÕES */}
          <View style={styles.infoSection}>
            <Text style={styles.title} numberOfLines={3}>{book.title || 'Sem título'}</Text>
            <Text style={styles.author}>
              {book.author || book.author_name?.[0] || 'Autor desconhecido'}
            </Text>

            {book.number_of_pages_median && (
              <Text style={styles.pages}>{book.number_of_pages_median} páginas</Text>
            )}
          </View>
        </View>

        {/* BOTÃO COMEÇAR A LER */}
        <TouchableOpacity 
          style={[styles.bigButton, styles.readButton]} 
          onPress={handleStartReading}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <MaterialIcons name="play-arrow" size={20} color="#FFF" />
              <Text style={styles.bigButtonText}>Começar a Ler!</Text>
            </>
          )}
        </TouchableOpacity>

        {/* ADICIONAR A ESTANTES */}
        <Text style={styles.sectionTitle}>Adicionar a Estantes</Text>

        <View style={styles.shelfButtons}>
          <TouchableOpacity 
            style={styles.shelfButton} 
            onPress={handleToggleFavorite}
            disabled={loading}
          >
            <MaterialIcons 
              name={book.isFavorite ? "favorite" : "favorite-border"} 
              size={24} 
              color={book.isFavorite ? "#E91E63" : "#2A5288"} 
            />
            <Text style={styles.shelfButtonText}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.shelfButton} 
            onPress={handleAddToWishlist}
            disabled={loading}
          >
            <MaterialIcons name="bookmark-border" size={24} color="#2A5288" />
            <Text style={styles.shelfButtonText}>Wishlist</Text>
          </TouchableOpacity>
        </View>

        {/* ADICIONAR À BIBLIOTECA */}
        <TouchableOpacity 
          style={[styles.bigButton, styles.libraryButton]} 
          onPress={handleAddToMyLibrary}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <MaterialIcons name="library-books" size={20} color="#FFF" />
              <Text style={styles.bigButtonText}>Adicionar à Minha Biblioteca</Text>
            </>
          )}
        </TouchableOpacity>

        {/* SINOPSE - SEMPRE VISÍVEL */}
        <Text style={styles.sectionTitle}>Sinopse</Text>
        <View style={styles.synopsisCard}>
          <Text style={styles.synopsisText}>
            {book.description?.value || book.description || 'Sem descrição disponível.'}
          </Text>
        </View>

        {/* INFORMAÇÕES ADICIONAIS */}
        <View style={styles.additionalInfo}>
          {(book.publish_year?.[0] || book.first_publish_year) && (
            <View style={styles.infoRow}>
              <MaterialIcons name="calendar-today" size={18} color="#666" />
              <Text style={styles.infoText}>
                Publicado em {book.publish_year?.[0] || book.first_publish_year}
              </Text>
            </View>
          )}

          {book.publisher?.[0] && (
            <View style={styles.infoRow}>
              <MaterialIcons name="business" size={18} color="#666" />
              <Text style={styles.infoText}>{book.publisher[0]}</Text>
            </View>
          )}

          {book.language?.[0] && (
            <View style={styles.infoRow}>
              <MaterialIcons name="language" size={18} color="#666" />
              <Text style={styles.infoText}>
                {book.language[0] === 'por' || book.language[0] === 'pt' ? 'Português' : 
                 book.language[0] === 'eng' ? 'Inglês' : book.language[0]}
              </Text>
            </View>
          )}
        </View>

        {/* CATEGORIAS */}
        {book.subject && book.subject.length > 0 && (
          <View style={styles.categoriesCard}>
            <Text style={styles.categoriesTitle}>Categorias</Text>
            <View style={styles.categoriesContainer}>
              {book.subject.slice(0, 6).map((cat, index) => (
                <View key={index} style={styles.categoryChip}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8D5A8',
  },
  header: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
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
  content: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2A5288',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    alignItems: 'center',
  },
  coverContainer: {
    marginBottom: 14,
  },
  cover: {
    width: 140,
    height: 200,
    borderRadius: 8,
    elevation: 3,
  },
  noCover: {
    width: 140,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A5288',
    textAlign: 'center',
    marginBottom: 6,
  },
  author: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  pages: {
    fontSize: 12,
    color: '#999999',
  },
  bigButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
    gap: 8,
  },
  readButton: {
    backgroundColor: '#2A5288',
  },
  libraryButton: {
    backgroundColor: '#7B1FA2',
  },
  bigButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A5288',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  shelfButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 14,
    gap: 10,
  },
  shelfButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2A5288',
    elevation: 2,
  },
  shelfButtonText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2A5288',
  },
  synopsisCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  synopsisText: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 20,
    textAlign: 'justify',
  },
  additionalInfo: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666666',
  },
  categoriesCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A5288',
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChip: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 11,
    color: '#1976D2',
    fontWeight: '600',
  },
});

export default BookDetailsScreen;