// src/views/screens/FavoritesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([
    {
      id: '1',
      title: 'O Senhor dos Anéis',
      author: 'J.R.R. Tolkien',
      image: 'https://m.media-amazon.com/images/I/71jLBXtWJWL._AC_UF1000,1000_QL80_.jpg',
      rating: 5,
    },
    {
      id: '2',
      title: '1984',
      author: 'George Orwell',
      image: 'https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg',
      rating: 5,
    },
    {
      id: '3',
      title: 'Harry Potter e a Pedra Filosofal',
      author: 'J.K. Rowling',
      image: 'https://m.media-amazon.com/images/I/81iqZ2HHD-L._AC_UF1000,1000_QL80_.jpg',
      rating: 4,
    },
  ]);

  const handleRemoveFavorite = (bookId) => {
    Alert.alert(
      'Remover dos Favoritos',
      'Tens a certeza que queres remover este livro dos favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setFavorites(favorites.filter(book => book.id !== bookId));
          },
        },
      ]
    );
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetails', { book: item })}
    >
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{'⭐'.repeat(item.rating)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Text style={styles.favoriteIcon}>❤️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Favoritos ❤️</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyTitle}>Nenhum favorito</Text>
          <Text style={styles.emptySubtitle}>
            Adiciona livros aos teus favoritos para os veres aqui!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos ❤️</Text>
        <Text style={styles.headerCount}>{favorites.length} livros</Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3E5AB' },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  headerCount: { fontSize: 14, color: '#666' },
  listContainer: { padding: 15 },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  bookImage: { width: 80, height: 120 },
  bookInfo: { flex: 1, padding: 15, justifyContent: 'center' },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  bookAuthor: { fontSize: 14, color: '#666', marginBottom: 5 },
  ratingContainer: { marginTop: 5 },
  rating: { fontSize: 14 },
  favoriteButton: { padding: 15, justifyContent: 'center' },
  favoriteIcon: { fontSize: 24 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  emptySubtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
});

export default FavoritesScreen;