// src/views/screens/WishListScreen.js
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

const WishListScreen = ({ navigation }) => {
  const [wishlist, setWishlist] = useState([
    {
      id: '1',
      title: 'Dune',
      author: 'Frank Herbert',
      image: 'https://m.media-amazon.com/images/I/81ym3zu0E8L._AC_UF1000,1000_QL80_.jpg',
      priority: 'high',
    },
    {
      id: '2',
      title: 'O Hobbit',
      author: 'J.R.R. Tolkien',
      image: 'https://m.media-amazon.com/images/I/71V2v2GtAtL._AC_UF1000,1000_QL80_.jpg',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Fundação',
      author: 'Isaac Asimov',
      image: 'https://m.media-amazon.com/images/I/81dK2ZPVi8L._AC_UF1000,1000_QL80_.jpg',
      priority: 'low',
    },
  ]);

  const handleRemoveFromWishlist = (bookId) => {
    Alert.alert(
      'Remover da Lista de Desejos',
      'Tens a certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setWishlist(wishlist.filter(book => book.id !== bookId));
          },
        },
      ]
    );
  };

  const handleMoveToReading = (book) => {
    Alert.alert(
      'Começar a Ler',
      `Queres começar a ler "${book.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: () => {
            setWishlist(wishlist.filter(b => b.id !== book.id));
            Alert.alert('Sucesso', 'Livro movido para "A Ler"!');
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#999';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  const renderBook = ({ item }) => (
    <View style={styles.bookCard}>
      <TouchableOpacity 
        style={styles.bookContent}
        onPress={() => navigation.navigate('BookDetails', { book: item })}
      >
        <Image source={{ uri: item.image }} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>
              Prioridade: {getPriorityText(item.priority)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleMoveToReading(item)}
        >
          <Text style={styles.actionButtonText}>📖 Começar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => handleRemoveFromWishlist(item.id)}
        >
          <Text style={styles.actionButtonText}>🗑️ Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lista de Desejos 💭</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>Lista vazia</Text>
          <Text style={styles.emptySubtitle}>
            Adiciona livros que queres ler no futuro!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lista de Desejos 💭</Text>
        <Text style={styles.headerCount}>{wishlist.length} livros</Text>
      </View>

      <FlatList
        data={wishlist}
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
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  bookContent: {
    flexDirection: 'row',
  },
  bookImage: { width: 80, height: 120 },
  bookInfo: { flex: 1, padding: 15, justifyContent: 'center' },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  bookAuthor: { fontSize: 14, color: '#666', marginBottom: 10 },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  priorityText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  actionButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  removeButton: {
    borderLeftWidth: 1,
    borderLeftColor: '#EEE',
  },
  actionButtonText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
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

export default WishListScreen;