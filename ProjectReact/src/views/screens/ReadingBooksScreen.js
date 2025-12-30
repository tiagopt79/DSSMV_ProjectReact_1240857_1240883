// src/views/screens/ReadingBooksScreen.js
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

const ReadingBooksScreen = ({ navigation }) => {
  const [readingBooks, setReadingBooks] = useState([
    {
      id: '1',
      title: 'O Senhor dos Anéis',
      author: 'J.R.R. Tolkien',
      image: 'https://m.media-amazon.com/images/I/71jLBXtWJWL._AC_UF1000,1000_QL80_.jpg',
      currentPage: 150,
      totalPages: 500,
      progress: 30,
    },
    {
      id: '2',
      title: 'Harry Potter e a Pedra Filosofal',
      author: 'J.K. Rowling',
      image: 'https://m.media-amazon.com/images/I/81iqZ2HHD-L._AC_UF1000,1000_QL80_.jpg',
      currentPage: 200,
      totalPages: 250,
      progress: 80,
    },
  ]);

  const handleUpdateProgress = (bookId, currentBook) => {
    Alert.prompt(
      'Atualizar Progresso',
      `Página atual de "${currentBook.title}":`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Atualizar',
          onPress: (newPage) => {
            const page = parseInt(newPage);
            if (!isNaN(page) && page >= 0 && page <= currentBook.totalPages) {
              const progress = Math.round((page / currentBook.totalPages) * 100);
              setReadingBooks(readingBooks.map(book =>
                book.id === bookId
                  ? { ...book, currentPage: page, progress }
                  : book
              ));
            } else {
              Alert.alert('Erro', 'Página inválida!');
            }
          },
        },
      ],
      'plain-text',
      currentBook.currentPage.toString()
    );
  };

  const handleMarkAsFinished = (book) => {
    Alert.alert(
      'Terminar Livro',
      `Terminaste de ler "${book.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: () => {
            setReadingBooks(readingBooks.filter(b => b.id !== book.id));
            Alert.alert('Parabéns! 🎉', `"${book.title}" foi marcado como terminado!`);
          },
        },
      ]
    );
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return '#F44336';
    if (progress < 70) return '#FF9800';
    return '#4CAF50';
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
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Página {item.currentPage} de {item.totalPages}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${item.progress}%`,
                    backgroundColor: getProgressColor(item.progress)
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressPercentage}>{item.progress}%</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUpdateProgress(item.id, item)}
        >
          <Text style={styles.actionButtonText}>📝 Atualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.finishButton]}
          onPress={() => handleMarkAsFinished(item)}
        >
          <Text style={styles.actionButtonText}>✅ Terminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (readingBooks.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>A Ler 📖</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>Nenhum livro a ler</Text>
          <Text style={styles.emptySubtitle}>
            Começa a ler um livro da tua lista de desejos!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>A Ler 📖</Text>
        <Text style={styles.headerCount}>{readingBooks.length} livros</Text>
      </View>

      <FlatList
        data={readingBooks}
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
  progressContainer: { marginTop: 10 },
  progressText: { fontSize: 12, color: '#666', marginBottom: 5 },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#254E70',
  },
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
  finishButton: {
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

export default ReadingBooksScreen;