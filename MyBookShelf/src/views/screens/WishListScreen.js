import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, RefreshControl, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { updateBook, deleteBook, fetchBooks } from '../../flux/actions';
import colors from '../../theme/colors';

const WishListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const { books } = useSelector(state => state.books);

  const wishlist = books.filter(book => book.status === 'wishlist' || book.isWishlist);

  useEffect(() => {
    if (books.length === 0) dispatch(fetchBooks());
  }, [dispatch, books.length]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchBooks());
    setRefreshing(false);
  }, [dispatch]);

  const handleRemoveFromWishlist = (book) => {
    Alert.alert(
      'Remover',
      `Remover "${book.title}" da wishlist?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => dispatch(deleteBook(book._id)) },
      ]
    );
  };

  const handleMoveToReading = (book) => {
    Alert.alert(
      'Ler',
      `Começar a ler "${book.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sim', 
          onPress: () => {
            dispatch(updateBook(book._id, { status: 'reading', last_read: new Date().toISOString() }));
            navigation.navigate('ReadingBooks');
          } 
        },
      ]
    );
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookCard}
      onPress={() => navigation.navigate('LibraryBookDetails', { book: item })}
      activeOpacity={0.9}
    >
      <View style={styles.bookContent}>
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
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleMoveToReading(item)}>
          <MaterialIcons name="play-arrow" size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Começar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.removeButton]} onPress={() => handleRemoveFromWishlist(item)}>
          <MaterialIcons name="delete-outline" size={20} color={colors.error} />
          <Text style={[styles.actionButtonText, styles.removeText]}>Remover</Text>
        </TouchableOpacity>
      </View>
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
        <Text style={styles.statsTitle}>Lista de Desejos</Text>
        <View style={styles.statsRow}>
          <MaterialIcons name="bookmark-border" size={38} color={colors.primary} />
          <View style={styles.statsInfo}>
            <Text style={styles.statsNumber}>{wishlist.length}</Text>
            <Text style={styles.statsLabel}>livros na wishlist</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={wishlist}
        renderItem={renderBook}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="bookmark-border" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Wishlist Vazia</Text>
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
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 22,
    borderRadius: 16,
    elevation: 6,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  bookContent: { flexDirection: 'row', padding: 16 },
  coverContainer: { marginRight: 16 },
  bookImage: { width: 75, height: 110, borderRadius: 8, backgroundColor: '#E0E0E0' },
  noCover: { justifyContent: 'center', alignItems: 'center' },
  bookInfo: { flex: 1, justifyContent: 'center' },
  bookTitle: { fontSize: 17, fontWeight: 'bold', color: '#2A5288', marginBottom: 6 },
  bookAuthor: { fontSize: 14, color: '#666', marginBottom: 8 },
  pagesRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  pagesText: { fontSize: 12, color: '#999' },
  favoriteTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  favoriteText: { fontSize: 11, fontWeight: '600', color: '#E91E63' },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  removeButton: { borderLeftWidth: 1, borderLeftColor: '#E0E0E0' },
  actionButtonText: { fontSize: 14, fontWeight: '700', color: '#2A5288' },
  removeText: { color: '#D32F2F' },
  emptyContainer: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginTop: 20, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A5288',
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 4,
  },
  emptyButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default WishListScreen;