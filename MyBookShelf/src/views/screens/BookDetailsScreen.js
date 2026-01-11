import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { addBook, updateBook, toggleFavorite } from '../../flux/actions'; // Actions Redux
import colors from '../../theme/colors';

const BookDetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { book: initialBook } = route.params || {};
  
  // Acedemos à lista de livros do Redux
  const libraryBooks = useSelector(state => state.books.books);
  
  const [book, setBook] = useState(initialBook);
  const [loading, setLoading] = useState(false);

  // Verifica INSTANTANEAMENTE se o livro está na biblioteca olhando para o Redux
  const libraryBook = libraryBooks.find(b => 
    (b.isbn && b.isbn === book.isbn) || 
    (b._id && b._id === book._id) ||
    (b.title === book.title && b.author === book.author) // Fallback
  );

  const isInLibrary = !!libraryBook;
  const currentStatus = libraryBook ? libraryBook.status : null;

  // Atualiza o estado local 'book' se ele mudar no Redux (reatividade!)
  useEffect(() => {
    if (libraryBook) {
      setBook(prev => ({ ...prev, ...libraryBook }));
    }
  }, [libraryBook]);

  if (!initialBook) { navigation.goBack(); return null; }

  const handleAction = async (actionType, status) => {
    setLoading(true);
    try {
      if (!isInLibrary) {
        // ADICIONAR (Se não existe)
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
        // ATUALIZAR (Se já existe)
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
      
      // Navegação opcional após sucesso
      if (status === 'reading') setTimeout(() => navigation.navigate('ReadingBooks'), 500);
      
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o livro.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
            {isInLibrary && (
              <View style={styles.inLibraryBadge}>
                <MaterialIcons name="check-circle" size={16} color={colors.success} />
                <Text style={styles.inLibraryText}>Na biblioteca: {getStatusLabel(currentStatus)}</Text>
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