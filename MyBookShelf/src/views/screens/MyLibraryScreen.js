import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../../flux/actions';
import colors from '../../theme/colors';

const MyLibraryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Lemos diretamente do Redux!
  const { books, loading } = useSelector(state => state.books);
  
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  // Carrega os livros ao abrir o ecrã
  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchBooks()); // Força atualização via Redux
    setRefreshing(false);
  }, [dispatch]);

  const getFilteredBooks = () => {
    if (filter === 'all') return books;
    if (filter === 'toRead') return books.filter(book => book.status === 'toRead' || book.status === 'unread');
    return books.filter(book => book.status === filter);
  };
  const filteredBooks = getFilteredBooks();

  const getCounts = () => ({
    all: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    toRead: books.filter(b => b.status === 'toRead' || b.status === 'unread').length,
    wishlist: books.filter(b => b.status === 'wishlist').length,
    read: books.filter(b => b.status === 'read').length,
  });
  const counts = getCounts();

  const getFilterLabel = () => {
    const labels = { reading: 'a ler', toRead: 'para ler', wishlist: 'na wishlist', read: 'lido' };
    return labels[filter] || '';
  };

  const renderBookCard = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      // Navegamos para o ecrã unificado
      onPress={() => navigation.navigate('BookDetails', { book: item })}
      activeOpacity={0.9}
    >
      <View style={styles.coverContainer}>
        {item.cover ? (
          <Image source={{ uri: item.cover }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.noCover]}>
            <MaterialIcons name="menu-book" size={40} color={colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{item.author || 'Autor Desconhecido'}</Text>
        {(item.pages > 0 || item.pageCount > 0) && (
          <Text style={styles.bookPages}>{item.pages || item.pageCount} páginas</Text>
        )}

        <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
          <Text style={styles.statusText}>
            {item.status === 'reading' ? '📖 A Ler' :
             item.status === 'toRead' || item.status === 'unread' ? '📚 Para Ler' :
             item.status === 'wishlist' ? '💭 Wishlist' :
             item.status === 'read' ? '✅ Lido' : '📚 Para Ler'}
          </Text>
        </View>

        {item.isFavorite && (
          <MaterialIcons name="favorite" size={20} color={colors.favorite} style={styles.favoriteIcon} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="library-books" size={80} color={colors.iconGray} />
      <Text style={styles.emptyTitle}>
        {filter === 'all' ? 'Biblioteca Vazia' : `Nenhum livro ${getFilterLabel()}`}
      </Text>
      <Text style={styles.emptyText}>
        {filter === 'all' ? 'Adicione o seu primeiro livro!' : 'Tente outro filtro'}
      </Text>
      {filter === 'all' && (
        <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('Search')}>
          <MaterialIcons name="search" size={22} color={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.emptyButtonText}>Pesquisar Livros</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing && books.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>A carregar biblioteca...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Minha Biblioteca</Text>
        <View style={styles.statsRow}>
          <MaterialIcons name="library-books" size={38} color={colors.primary} />
          <View style={styles.statsInfo}>
            <Text style={styles.statsNumber}>{books.length}</Text>
            <Text style={styles.statsLabel}>{books.length === 1 ? 'livro total' : 'livros totais'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <FilterButton label="Todos" count={counts.all} active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterButton label="A Ler" count={counts.reading} active={filter === 'reading'} onPress={() => setFilter('reading')} />
        <FilterButton label="Para Ler" count={counts.toRead} active={filter === 'toRead'} onPress={() => setFilter('toRead')} />
        <FilterButton label="Wishlist" count={counts.wishlist} active={filter === 'wishlist'} onPress={() => setFilter('wishlist')} />
        <FilterButton label="Lidos" count={counts.read} active={filter === 'read'} onPress={() => setFilter('read')} />
      </View>

      <FlatList
        data={filteredBooks} renderItem={renderBookCard} keyExtractor={(item) => item._id || item.isbn}
        contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const FilterButton = ({ label, count, active, onPress }) => (
  <TouchableOpacity style={[styles.filterButton, active && styles.filterButtonActive]} onPress={onPress}>
    <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    {count > 0 && (
      <View style={[styles.filterBadge, active && styles.filterBadgeActive]}>
        <Text style={[styles.filterBadgeText, active && styles.filterBadgeTextActive]}>{count}</Text>
      </View>
    )}
  </TouchableOpacity>
);

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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  filterButtonActive: { backgroundColor: '#2A5288' },
  filterText: { fontSize: 13, color: '#666', fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  filterBadge: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  filterBadgeActive: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  filterBadgeText: { fontSize: 11, fontWeight: '700', color: '#333' },
  filterBadgeTextActive: { color: '#FFFFFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  coverContainer: { marginRight: 16 },
  cover: { width: 85, height: 125, borderRadius: 10, backgroundColor: '#E0E0E0' },
  noCover: { justifyContent: 'center', alignItems: 'center' },
  bookInfo: { flex: 1, justifyContent: 'space-between' },
  bookTitle: { fontSize: 17, fontWeight: 'bold', color: '#2A5288', marginBottom: 5 },
  bookAuthor: { fontSize: 14, color: '#666', marginBottom: 4 },
  bookPages: { fontSize: 12, color: '#999', marginBottom: 8 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  status_reading: { backgroundColor: '#FFF4E6' },
  status_toRead: { backgroundColor: '#E8EAF6' },
  status_unread: { backgroundColor: '#E8EAF6' },
  status_wishlist: { backgroundColor: '#E6F3FF' },
  status_read: { backgroundColor: '#E6F9F0' },
  statusText: { fontSize: 11, fontWeight: '600' },
  favoriteIcon: { position: 'absolute', top: 5, right: 5 },
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

export default MyLibraryScreen;