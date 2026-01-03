import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBooks, updateBook, deleteBook } from '../../services/restDbApi';

const WishListScreen = ({ navigation }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const allBooks = await getBooks();
      const wishlistBooks = allBooks.filter(book => book.status === 'wishlist');
      setWishlist(wishlistBooks);
      console.log(`${wishlistBooks.length} livros na wishlist`);
    } catch (error) {
      console.error('Erro ao carregar wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWishlist();
    setRefreshing(false);
  }, []);

  const handleRemoveFromWishlist = (book) => {
    Alert.alert(
      'Remover da Lista de Desejos',
      `Tens a certeza que queres remover "${book.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(book._id);
              setWishlist(wishlist.filter(b => b._id !== book._id));
              Alert.alert('Sucesso', 'Livro removido da wishlist');
            } catch (error) {
              console.error('Erro ao remover:', error);
              Alert.alert('Erro', 'Não foi possível remover o livro');
            }
          },
        },
      ]
    );
  };

  const handleMoveToReading = async (book) => {
    Alert.alert(
      'Começar a Ler',
      `Queres começar a ler "${book.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const updatedBook = {
                ...book,
                status: 'reading',
                last_read: new Date().toISOString(),
              };
              await updateBook(book._id, updatedBook);
              setWishlist(wishlist.filter(b => b._id !== book._id));
              Alert.alert('Sucesso', 'Livro movido para "A Ler"!');
              navigation.navigate('ReadingBooks');
            } catch (error) {
              console.error('Erro ao mover:', error);
              Alert.alert('Erro', 'Não foi possível mover o livro');
            }
          },
        },
      ]
    );
  };

  const renderBook = ({ item }) => (
    <View style={wishlistStyles.bookCard}>
      <TouchableOpacity 
        style={wishlistStyles.bookContent}
        onPress={() => navigation.navigate('BookDetails', { book: item })}
      >
        <View style={wishlistStyles.coverContainer}>
          {item.cover ? (
            <Image source={{ uri: item.cover }} style={wishlistStyles.bookImage} />
          ) : (
            <View style={[wishlistStyles.bookImage, wishlistStyles.noCover]}>
              <Icon name="book" size={35} color="#2A5288" />
            </View>
          )}
        </View>
        
        <View style={wishlistStyles.bookInfo}>
          <Text style={wishlistStyles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={wishlistStyles.bookAuthor} numberOfLines={1}>
            {item.author || 'Autor Desconhecido'}
          </Text>
          
          {item.pages > 0 && (
            <View style={wishlistStyles.pagesRow}>
              <Icon name="menu-book" size={14} color="#999" />
              <Text style={wishlistStyles.pagesText}>{item.pages} páginas</Text>
            </View>
          )}

          {item.isFavorite && (
            <View style={wishlistStyles.favoriteTag}>
              <Icon name="favorite" size={14} color="#E91E63" />
              <Text style={wishlistStyles.favoriteText}>Favorito</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      <View style={wishlistStyles.actionButtons}>
        <TouchableOpacity
          style={wishlistStyles.actionButton}
          onPress={() => handleMoveToReading(item)}
        >
          <Icon name="play-arrow" size={20} color="#2A5288" />
          <Text style={wishlistStyles.actionButtonText}>Começar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[wishlistStyles.actionButton, wishlistStyles.removeButton]}
          onPress={() => handleRemoveFromWishlist(item)}
        >
          <Icon name="delete-outline" size={20} color="#D32F2F" />
          <Text style={[wishlistStyles.actionButtonText, wishlistStyles.removeText]}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={wishlistStyles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />
        <View style={wishlistStyles.header}>
          <TouchableOpacity 
            style={wishlistStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={26} color="#2A5288" />
          </TouchableOpacity>
        </View>
        <View style={wishlistStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#2A5288" />
          <Text style={wishlistStyles.loadingText}>Carregando wishlist...</Text>
        </View>
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={wishlistStyles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />
        <View style={wishlistStyles.header}>
          <TouchableOpacity 
            style={wishlistStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={26} color="#2A5288" />
          </TouchableOpacity>
        </View>
        <View style={wishlistStyles.statsCard}>
          <Text style={wishlistStyles.statsTitle}>Lista de Desejos</Text>
          <View style={wishlistStyles.statsRow}>
            <Icon name="bookmark-border" size={38} color="#2A5288" />
            <View style={wishlistStyles.statsInfo}>
              <Text style={wishlistStyles.statsNumber}>0</Text>
              <Text style={wishlistStyles.statsLabel}>livros na wishlist</Text>
            </View>
          </View>
        </View>
        <View style={wishlistStyles.emptyContainer}>
          <Icon name="bookmark-border" size={80} color="#AAAAAA" />
          <Text style={wishlistStyles.emptyTitle}>Wishlist Vazia</Text>
          <Text style={wishlistStyles.emptyText}>
            Adiciona livros que queres ler no futuro!
          </Text>
          <TouchableOpacity
            style={wishlistStyles.emptyButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Icon name="search" size={22} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={wishlistStyles.emptyButtonText}>Procurar Livros</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={wishlistStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />
      
      <View style={wishlistStyles.header}>
        <TouchableOpacity 
          style={wishlistStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={26} color="#2A5288" />
        </TouchableOpacity>
      </View>

      <View style={wishlistStyles.statsCard}>
        <Text style={wishlistStyles.statsTitle}>Lista de Desejos</Text>
        <View style={wishlistStyles.statsRow}>
          <Icon name="bookmark-border" size={38} color="#2A5288" />
          <View style={wishlistStyles.statsInfo}>
            <Text style={wishlistStyles.statsNumber}>{wishlist.length}</Text>
            <Text style={wishlistStyles.statsLabel}>
              {wishlist.length === 1 ? 'livro na wishlist' : 'livros na wishlist'}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={wishlist}
        renderItem={renderBook}
        keyExtractor={(item) => item._id}
        contentContainerStyle={wishlistStyles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2A5288']}
            tintColor="#2A5288"
          />
        }
      />
    </View>
  );
};

const wishlistStyles = StyleSheet.create({
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