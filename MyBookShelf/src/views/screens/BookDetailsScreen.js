// src/views/screens/BookDetailsScreen.js - COM VALIDAÇÕES E RESET DE PROGRESSO

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
  const { book: initialBook } = route.params || {};
  
  if (!initialBook) {
    navigation.goBack();
    return null;
  }
  
  const [book, setBook] = useState(initialBook);
  const [loading, setLoading] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [libraryBookId, setLibraryBookId] = useState(null);
  const [libraryBookStatus, setLibraryBookStatus] = useState(null);

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
        setLibraryBookStatus(existingBook.status);
        setBook({ ...book, ...existingBook });
      } else {
        setIsInLibrary(false);
        setLibraryBookStatus(null);
      }
    } catch (error) {
      console.error('Erro ao verificar biblioteca:', error);
    }
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'reading': 'A Ler',
      'read': 'Lido',
      'wishlist': 'Wishlist',
      'toRead': 'Para Ler',
    };
    return statusLabels[status] || status;
  };

  const addToLibrary = async (status, message, navigateTo) => {
    try {
      // VALIDAÇÃO: Verifica se já está na biblioteca com o mesmo status
      if (isInLibrary && libraryBookStatus === status) {
        Alert.alert(
          'Livro já adicionado',
          `Este livro já está em "${getStatusLabel(status)}"!`,
          [{ text: 'OK' }]
        );
        return;
      }

      // VALIDAÇÃO: Se já está na biblioteca com status diferente, pergunta se quer mudar
      if (isInLibrary && libraryBookStatus !== status) {
        Alert.alert(
          'Livro já na biblioteca',
          `Este livro já está em "${getStatusLabel(libraryBookStatus)}". Queres mover para "${getStatusLabel(status)}"?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Sim, mover',
              onPress: async () => {
                await performUpdate(status, message, navigateTo);
              },
            },
          ]
        );
        return;
      }

      // Se não está na biblioteca, adiciona normalmente
      await performAdd(status, message, navigateTo);

    } catch (error) {
      console.error('Erro ao adicionar:', error);
      Alert.alert('Erro', `Não foi possível adicionar o livro.\n\n${error.message}`);
      setLoading(false);
    }
  };

  const performAdd = async (status, message, navigateTo) => {
    setLoading(true);

    const isbn = book.isbn || book.isbn_13?.[0] || book.key?.split('/').pop() || `temp_${Date.now()}`;

    const bookData = {
      isbn: isbn,
      title: book.title || 'Sem título',
      author: book.author || book.authors?.[0] || book.author_name?.[0] || 'Autor desconhecido',
      cover: book.cover || book.coverUrl || book.thumbnail || '',
      description: book.description?.value || book.description || '',
      publishYear: book.publishedDate?.split('-')[0] || book.publishYear || '',
      pages: book.pageCount || book.pages || book.number_of_pages_median || 0,
      rating: book.rating || 0,
      status: status,
      isFavorite: book.isFavorite || false,
      isWishlist: status === 'wishlist',
      currentPage: 0,
      current_page: 0,
      progress: 0,
      notes: '',
      categories: Array.isArray(book.categories) ? book.categories.join(', ') : 
                  Array.isArray(book.subject) ? book.subject.join(', ') : '',
      language: Array.isArray(book.language) ? book.language[0] : book.language || 'pt',
      publisher: Array.isArray(book.publisher) ? book.publisher[0] : book.publisher || '',
    };

    const newBook = await addBook(bookData);
    setIsInLibrary(true);
    setLibraryBookId(newBook._id);
    setLibraryBookStatus(status);
    setBook({ ...book, ...newBook });

    Alert.alert('Sucesso!', message);
    setLoading(false);

    if (navigateTo) {
      setTimeout(() => {
        navigation.navigate(navigateTo);
      }, 500);
    }
  };

  const performUpdate = async (status, message, navigateTo) => {
    setLoading(true);

    // Prepara os campos a atualizar
    const updates = {
      status,
      isWishlist: status === 'wishlist',
    };

    // Se estiver a mover para "reading" (A Ler), reseta o progresso
    if (status === 'reading') {
      updates.current_page = 0;
      updates.currentPage = 0;
      updates.progress = 0;
    }

    // Se estiver a marcar como "read" (Lido), completa o progresso
    if (status === 'read') {
      const totalPages = book.pages || book.pageCount || 0;
      updates.current_page = totalPages;
      updates.currentPage = totalPages;
      updates.progress = 100;
      updates.finished_date = new Date().toISOString();
    }

    const updated = await updateBook(libraryBookId, updates);
    
    setLibraryBookStatus(status);
    setBook({ ...book, ...updates });

    Alert.alert('Sucesso!', message);
    setLoading(false);

    if (navigateTo) {
      setTimeout(() => {
        navigation.navigate(navigateTo);
      }, 500);
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
        // Se não está na biblioteca, adiciona como favorito
        const isbn = book.isbn || book.isbn_13?.[0] || book.key?.split('/').pop() || `temp_${Date.now()}`;
        
        const bookData = {
          isbn: isbn,
          title: book.title || 'Sem título',
          author: book.author || book.authors?.[0] || book.author_name?.[0] || 'Autor desconhecido',
          cover: book.cover || book.coverUrl || book.thumbnail || '',
          description: book.description?.value || book.description || '',
          publishYear: book.publishedDate?.split('-')[0] || book.publishYear || '',
          pages: book.pageCount || book.pages || book.number_of_pages_median || 0,
          rating: book.rating || 0,
          status: 'toRead',
          isFavorite: true,
          isWishlist: false,
          currentPage: 0,
          current_page: 0,
          progress: 0,
          notes: '',
          categories: Array.isArray(book.categories) ? book.categories.join(', ') : 
                      Array.isArray(book.subject) ? book.subject.join(', ') : '',
          language: Array.isArray(book.language) ? book.language[0] : book.language || 'pt',
          publisher: Array.isArray(book.publisher) ? book.publisher[0] : book.publisher || '',
        };

        setLoading(true);
        const newBook = await addBook(bookData);
        
        setIsInLibrary(true);
        setLibraryBookId(newBook._id);
        setLibraryBookStatus('toRead');
        setBook({ ...book, isFavorite: true, ...newBook });
        Alert.alert('Sucesso!', 'Livro adicionado aos Favoritos!');
        setLoading(false);

      } else {
        // Se já está na biblioteca, só toggle o favorito
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

  const coverUrl = book.cover || book.coverUrl || book.thumbnail || null;

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
        <Text style={styles.pageTitle}>Detalhes do Livro</Text>

        {/* CARD PRINCIPAL COM CAPA E INFO */}
        <View style={styles.mainCard}>
          <View style={styles.coverContainer}>
            {coverUrl ? (
              <Image source={{ uri: coverUrl }} style={styles.cover} />
            ) : (
              <View style={styles.noCover}>
                <MaterialIcons name="menu-book" size={50} color="#CCC" />
              </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.title} numberOfLines={3}>
              {book.title || 'Sem título'}
            </Text>
            <Text style={styles.author}>
              {book.author || book.authors?.[0] || book.author_name?.[0] || 'Autor desconhecido'}
            </Text>

            {(book.pageCount > 0 || book.pages > 0) && (
              <Text style={styles.pages}>
                {book.pageCount || book.pages} páginas
              </Text>
            )}

            {/* Indicador se já está na biblioteca */}
            {isInLibrary && (
              <View style={styles.inLibraryBadge}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.inLibraryText}>
                  Na biblioteca: {getStatusLabel(libraryBookStatus)}
                </Text>
              </View>
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

        {/* SINOPSE */}
        <Text style={styles.sectionTitle}>Sinopse</Text>
        <View style={styles.synopsisCard}>
          <Text style={styles.synopsisText}>
            {book.description?.value || book.description || 'Sem descrição disponível.'}
          </Text>
        </View>

        {/* INFORMAÇÕES ADICIONAIS */}
        <View style={styles.additionalInfo}>
          {(book.publishedDate || book.publishYear) && (
            <View style={styles.infoRow}>
              <MaterialIcons name="calendar-today" size={18} color="#666" />
              <Text style={styles.infoText}>
                Publicado em {book.publishedDate?.split('-')[0] || book.publishYear}
              </Text>
            </View>
          )}

          {book.publisher && (
            <View style={styles.infoRow}>
              <MaterialIcons name="business" size={18} color="#666" />
              <Text style={styles.infoText}>
                {Array.isArray(book.publisher) ? book.publisher[0] : book.publisher}
              </Text>
            </View>
          )}

          {book.language && (
            <View style={styles.infoRow}>
              <MaterialIcons name="language" size={18} color="#666" />
              <Text style={styles.infoText}>
                {book.language === 'pt' || book.language === 'por' ? 'Português' : 
                 book.language === 'en' || book.language === 'eng' ? 'Inglês' : book.language}
              </Text>
            </View>
          )}
        </View>

        {/* CATEGORIAS */}
        {(Array.isArray(book.categories) && book.categories.length > 0) && (
          <View style={styles.categoriesCard}>
            <Text style={styles.categoriesTitle}>Categorias</Text>
            <View style={styles.categoriesContainer}>
              {book.categories.slice(0, 6).map((cat, index) => (
                <View key={index} style={styles.categoryChip}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* CATEGORIAS (se vier como string) */}
        {(typeof book.categories === 'string' && book.categories.length > 0) && (
          <View style={styles.categoriesCard}>
            <Text style={styles.categoriesTitle}>Categorias</Text>
            <View style={styles.categoriesContainer}>
              {book.categories.split(',').slice(0, 6).map((cat, index) => (
                <View key={index} style={styles.categoryChip}>
                  <Text style={styles.categoryText}>{cat.trim()}</Text>
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
    marginBottom: 8,
  },
  inLibraryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  inLibraryText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
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