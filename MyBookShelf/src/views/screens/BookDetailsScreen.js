import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { addBook, updateBook, toggleFavorite } from '../../flux/actions';
import colors from '../../theme/colors';

const BookDetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { book: initialBook, scannedISBN, fromScanner, fromList, listId, listName } = route.params || {};
  
  const libraryBooks = useSelector(state => state.books.books);
  
  const [book, setBook] = useState(initialBook || null);
  const [loading, setLoading] = useState(false);
  const [fetchingBook, setFetchingBook] = useState(!!scannedISBN && !initialBook);

  
  useEffect(() => {
    const fetchBookData = async () => {
      if (scannedISBN && !initialBook && !book) {
        console.log('🔍 Iniciando busca do ISBN:', scannedISBN);
        setFetchingBook(true);
        
        try {
          
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${scannedISBN}`);
          const data = await response.json();
          
          console.log('📡 Resposta da API:', data);
          
          if (data.items && data.items.length > 0) {
            const bookInfo = data.items[0].volumeInfo;
            
            const bookData = {
              title: bookInfo.title || 'Sem título',
              author: bookInfo.authors ? bookInfo.authors[0] : 'Desconhecido',
              authors: bookInfo.authors || [],
              isbn: scannedISBN,
              isbn_13: bookInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || scannedISBN,
              cover: bookInfo.imageLinks?.thumbnail || bookInfo.imageLinks?.smallThumbnail || null,
              thumbnail: bookInfo.imageLinks?.thumbnail || null,
              description: bookInfo.description || '',
              pageCount: bookInfo.pageCount || 0,
              publisher: bookInfo.publisher || '',
              publishedDate: bookInfo.publishedDate || '',
              categories: bookInfo.categories || [],
              language: bookInfo.language || 'pt',
            };
            
            console.log('✅ Livro processado:', bookData.title);
            setBook(bookData);
          } else {
            console.log('❌ Nenhum livro encontrado');
            Alert.alert('Não encontrado', 'Não conseguimos encontrar informações para este ISBN.', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          }
        } catch (error) {
          console.error('❌ Erro ao buscar:', error);
          Alert.alert('Erro', 'Ocorreu um erro ao buscar o livro: ' + error.message, [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        } finally {
          setFetchingBook(false);
        }
      }
    };
    
    fetchBookData();
  }, [scannedISBN, initialBook]);


  const libraryBook = book ? libraryBooks.find(b => 
    (b.isbn && book.isbn && b.isbn === book.isbn) || 
    (b._id && book._id && b._id === book._id) ||
    (b.title === book.title && b.author === book.author)
  ) : null;

  const isInLibrary = !!libraryBook;
  const currentStatus = libraryBook ? libraryBook.status : null;

 
  useEffect(() => {
    if (libraryBook) {
      setBook(prev => ({ ...prev, ...libraryBook }));
    }
  }, [libraryBook]);

  const handleAction = async (actionType, status) => {
    if (!book) return;
    
    setLoading(true);
    try {
      if (!isInLibrary) {
        
        const newBookData = {
          ...book,
          status: status || 'toRead',
          isFavorite: actionType === 'favorite' ? true : (book.isFavorite || false),
          isWishlist: status === 'wishlist',
          dateAdded: new Date().toISOString()
        };
        await dispatch(addBook(newBookData));
        if (actionType !== 'favorite') Alert.alert('Sucesso', 'Livro adicionado à biblioteca!');
      } else {
       
        if (actionType === 'favorite') {
          await dispatch(toggleFavorite(libraryBook._id, libraryBook.isFavorite));
        } else if (status) {
          if (libraryBook.status === status) {
            Alert.alert('Info', 'O livro já está nesta estante.');
          } else {
            await dispatch(updateBook(libraryBook._id, { status, isWishlist: status === 'wishlist' }));
            Alert.alert('Sucesso', 'Estado do livro atualizado!');
          }
        }
      }
     
      if (fromList && listId && !isInLibrary) {
        
      }
      
      
      if (status === 'reading') setTimeout(() => navigation.navigate('ReadingBooks'), 500);
      
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o livro.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
  if (fetchingBook) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 15, fontSize: 16, color: colors.primary, fontWeight: 'bold' }}>A procurar livro...</Text>
      </View>
    );
  }

  
  if (!book) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      </View>
    );
  }

  const coverUrl = book.cover || book.coverUrl || book.thumbnail || null;
  const getStatusLabel = (s) => ({ reading: 'A Ler', read: 'Lido', wishlist: 'Wishlist', toRead: 'Para Ler' }[s] || s);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Detalhes do Livro</Text>

        <View style={styles.mainCard}>
          <View style={styles.coverContainer}>
            {coverUrl ? <Image source={{ uri: coverUrl }} style={styles.cover} /> : 
              <View style={styles.noCover}><MaterialIcons name="menu-book" size={50} color={colors.iconGray} /></View>}
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author || book.authors?.[0]}</Text>
            {(book.pageCount > 0 || book.pages > 0) && (
              <Text style={styles.pages}>{book.pageCount || book.pages} páginas</Text>
            )}
            {isInLibrary && (
              <View style={styles.inLibraryBadge}>
                <MaterialIcons name="check-circle" size={16} color={colors.success} />
                <Text style={styles.inLibraryText}>Na biblioteca: {getStatusLabel(currentStatus)}</Text>
              </View>
            )}
            {fromScanner && !isInLibrary && (
              <View style={[styles.inLibraryBadge, { backgroundColor: '#FFF3E0' }]}>
                <MaterialIcons name="qr-code-scanner" size={16} color="#FF9800" />
                <Text style={[styles.inLibraryText, { color: '#FF9800' }]}>Escaneado - Não está na biblioteca</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={[styles.bigButton, styles.readButton]} onPress={() => handleAction('update', 'reading')} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : 
            <><MaterialIcons name="play-arrow" size={20} color={colors.white} /><Text style={styles.bigButtonText}>Começar a Ler</Text></>}
        </TouchableOpacity>

        <View style={styles.shelfButtons}>
          <TouchableOpacity style={styles.shelfButton} onPress={() => handleAction('favorite')} disabled={loading}>
            <MaterialIcons name={book.isFavorite ? "favorite" : "favorite-border"} size={24} color={book.isFavorite ? colors.favorite : colors.primary} />
            <Text style={styles.shelfButtonText}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shelfButton} onPress={() => handleAction('update', 'wishlist')} disabled={loading}>
            <MaterialIcons name={currentStatus === 'wishlist' ? "bookmark" : "bookmark-border"} size={24} color={colors.primary} />
            <Text style={styles.shelfButtonText}>Wishlist</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={[styles.bigButton, styles.libraryButton]} onPress={() => handleAction('update', 'toRead')} disabled={loading}>
           <MaterialIcons name="library-add" size={20} color={colors.white} />
           <Text style={styles.bigButtonText}>Adicionar à Biblioteca</Text>
        </TouchableOpacity>

        {}
        {book.description && (
          <View style={styles.synopsisCard}>
            <Text style={styles.synopsisText}>{book.description}</Text>
          </View>
        )}

        <View style={{height: 50}} />
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
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cover: {
    width: 140,
    height: 200,
    borderRadius: 8,
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
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    textAlign: 'justify',
  },
});

export default BookDetailsScreen;