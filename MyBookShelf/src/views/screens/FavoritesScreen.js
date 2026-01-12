import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, fetchBooks } from '../../flux/actions';
import colors from '../../theme/colors';

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { books } = useSelector(state => state.books);
  
  // Filtro automático
  const favorites = books.filter(book => book.isFavorite === true);

  // Carregar se necessário
  useEffect(() => {
    if (books.length === 0) dispatch(fetchBooks());
  }, [dispatch, books.length]);

  const handleRemoveFavorite = (book) => {
    Alert.alert(
      'Remover dos Favoritos',
      `Remover "${book.title}" dos favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => dispatch(toggleFavorite(book._id, false)), 
        },
      ]
    );
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookCard}
      // CORREÇÃO: Navega para LibraryBookDetails
      onPress={() => navigation.navigate('LibraryBookDetails', { book: item })}
      activeOpacity={0.9}
    >
      <View style={styles.coverContainer}>
        {item.cover ? (
          <Image source={{ uri: item.cover }} style={styles.bookImage} />
        ) : (
          <View style={[styles.bookImage, styles.noCover]}>
            <MaterialIcons name="menu-book" size={35} color={colors.primary} />
          </View>
        )}
      </View>
      
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{item.author || 'Autor Desconhecido'}</Text>
        
        <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
          <Text style={styles.statusText}>
            {item.status === 'reading' ? '📖 A Ler' :
             item.status === 'wishlist' ? '💭 Wishlist' :
             item.status === 'read' ? '✅ Lido' : '📚 Para Ler'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.favoriteButton} onPress={() => handleRemoveFavorite(item)}>
        <MaterialIcons name="favorite" size={28} color={colors.favorite} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Favoritos</Text>
        <View style={styles.statsRow}>
          <MaterialIcons name="favorite" size={38} color={colors.favorite} />
          <View style={styles.statsInfo}>
            <Text style={styles.statsNumber}>{favorites.length}</Text>
            <Text style={styles.statsLabel}>{favorites.length === 1 ? 'livro favorito' : 'livros favoritos'}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderBook}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="favorite-border" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Nenhum Favorito</Text>
            <Text style={styles.emptyText}>Adiciona livros aos teus favoritos!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8D5A8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#4A4A4A', fontWeight: '500' },
  header: { paddingTop: 15, paddingBottom: 15, paddingHorizontal: 20 },
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
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 22,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  statsTitle: { fontSize: 24, fontWeight: 'bold', color: '#2A5288', marginBottom: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statsInfo: { marginLeft: 16, flex: 1 },
  statsNumber: { fontSize: 28, fontWeight: 'bold', color: '#000000', marginBottom: 2 },
  statsLabel: { fontSize: 14, color: '#4A4A4A' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 30 },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  coverContainer: { marginRight: 16 },
  bookImage: { 
    width: 75, 
    height: 110, 
    borderRadius: 8, 
    backgroundColor: '#E0E0E0' 
  },
  noCover: { 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  bookInfo: { flex: 1, justifyContent: 'center' },
  bookTitle: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#2A5288', 
    marginBottom: 6,
    lineHeight: 22,
  },
  bookAuthor: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 8 
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 6,
  },
  status_reading: { backgroundColor: '#FFF4E6' },
  status_wishlist: { backgroundColor: '#E6F3FF' },
  status_read: { backgroundColor: '#E6F9F0' },
  status_unread: { backgroundColor: '#F5F5F5' },
  statusText: { fontSize: 11, fontWeight: '600' },
  pagesRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  pagesText: { fontSize: 12, color: '#999' },
  favoriteButton: { 
    padding: 10, 
    justifyContent: 'center' 
  },
  emptyContainer: { 
    alignItems: 'center', 
    paddingVertical: 80, 
    paddingHorizontal: 30 
  },
  emptyTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#000', 
    marginTop: 20, 
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: { 
    fontSize: 15, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 30, 
    lineHeight: 22 
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A5288',
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
});

export default FavoritesScreen;