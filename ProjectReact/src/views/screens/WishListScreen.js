// src/views/screens/WishListScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, updateBookStatus } from '../../flux/actions';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WishListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector(state => state.books);
  
  // Filtra apenas os livros na wishlist
  const wishlistBooks = books.filter(book => book.status === 'wishlist');

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleMoveToReading = (bookId) => {
    dispatch(updateBookStatus(bookId, 'reading'));
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetails', { book });
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleBookPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.cover || 'https://via.placeholder.com/80x120' }}
        style={styles.bookImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {item.author}
        </Text>
        {item.pages && (
          <Text style={styles.pages}>{item.pages} páginas</Text>
        )}
        <View style={styles.statusContainer}>
          <Icon name="favorite-border" size={16} color="#E74C3C" />
          <Text style={styles.status}>Lista de Desejos</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleMoveToReading(item._id)}
      >
        <Icon name="play-arrow" size={24} color="#254E70" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#254E70" />
        <Text style={styles.loadingText}>A carregar lista...</Text>
      </View>
    );
  }

  if (wishlistBooks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="bookmark-border" size={80} color="#BDC3C7" />
        <Text style={styles.emptyTitle}>Lista Vazia</Text>
        <Text style={styles.emptySubtitle}>
          Adiciona livros que queres ler à tua lista de desejos!
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBook')}
        >
          <Text style={styles.addButtonText}>Adicionar Livros</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título da Página */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lista de Desejos ♡</Text>
        <Text style={styles.headerSubtitle}>
          {wishlistBooks.length} {wishlistBooks.length === 1 ? 'livro' : 'livros'}
        </Text>
      </View>

      <FlatList
        data={wishlistBooks}
        renderItem={renderBook}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5AB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E5AB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7F8C8D',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E5AB',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: '#254E70',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookImage: {
    width: 80,
    height: 120,
  },
  textContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  pages: {
    fontSize: 12,
    color: '#95A5A6',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FA',
  },
});

export default WishListScreen;