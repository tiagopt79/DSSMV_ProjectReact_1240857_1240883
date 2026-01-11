import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBooks, updateBook } from '../../services/restDbApi';

const ReadingBooksScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const allBooks = await getBooks();
      const readingBooks = allBooks.filter(book => book.status === 'reading');
      setBooks(readingBooks);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os livros.');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  }, [loadBooks]);

  const handleUpdateProgress = (book) => {
    const bookData = {
      _id: book._id,
      title: book.title,
      authors: [book.author || 'Autor desconhecido'],
      thumbnail: book.cover,
      pageCount: book.pages || 0,
      currentPage: book.current_page || 0,
    };
    
    navigation.navigate('BookProgress', { book: bookData });
  };

  const handleFinishBook = async (book) => {
    Alert.alert(
      '✓ Terminar Livro',
      `Marcar "${book.title}" como lido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const updatedBook = {
                ...book,
                status: 'read',
                current_page: book.pages,
                progress: 100,
                finished_date: new Date().toISOString(),
              };

              await updateBook(book._id, updatedBook);
              
              const updatedBooks = books.filter(b => b._id !== book._id);
              setBooks(updatedBooks);
              
              Alert.alert('🎉 Parabéns!', `Terminou "${book.title}"!`);
            } catch (error) {
              console.error('Erro:', error);
              Alert.alert('Erro', 'Não foi possível marcar como lido.');
            }
          },
        },
      ]
    );
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return '#E74C3C';
    if (progress < 70) return '#F39C12';
    return '#27AE60';
  };

  const renderBookCard = ({ item }) => {
    const currentPage = item.current_page || 0;
    const totalPages = item.pages || 0;
    
    const progress = (totalPages > 0 && currentPage > 0) 
      ? Math.round((currentPage / totalPages) * 100) 
      : 0;
    
    const progressColor = getProgressColor(progress);

    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => handleUpdateProgress(item)}
        activeOpacity={0.95}
      >
        {}
        <View style={styles.coverContainer}>
          {item.cover ? (
            <Image source={{ uri: item.cover }} style={styles.cover} />
          ) : (
            <View style={[styles.cover, styles.noCover]}>
              <Icon name="book" size={45} color="#2A5288" />
            </View>
          )}
        </View>

        {}
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.author || 'Autor Desconhecido'}
          </Text>

          {}
          <View style={styles.progressSection}>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progress}%`, backgroundColor: progressColor }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progress}% ({currentPage}/{totalPages})
            </Text>
          </View>

          {}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={() => handleUpdateProgress(item)}
            >
              <Icon name="edit" size={18} color="#2A5288" />
              <Text style={styles.updateBtnText}>Atualizar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.finishBtn}
              onPress={() => handleFinishBook(item)}
            >
              <Icon name="check-circle" size={18} color="#27AE60" />
              <Text style={styles.finishBtnText}>Terminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="menu-book" size={90} color="#AAAAAA" />
      <Text style={styles.emptyTitle}>Nenhum Livro em Leitura</Text>
      <Text style={styles.emptyText}>
        Adicione livros à sua biblioteca e comece a ler!
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => navigation.navigate('MyLibrary')}
      >
        <Icon name="library-books" size={22} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.emptyBtnText}>Ir para Biblioteca</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Icon name="arrow-back" size={26} color="#2A5288" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2A5288" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />
      
      {}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="arrow-back" size={26} color="#2A5288" />
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Livros em Leitura</Text>
        <View style={styles.statsRow}>
          <Icon name="menu-book" size={38} color="#2A5288" />
          <View style={styles.statsInfo}>
            <Text style={styles.statsNumber}>{books.length}</Text>
            <Text style={styles.statsLabel}>Livros a ler de momento</Text>
          </View>
        </View>
      </View>

      {}
      <FlatList
        data={books}
        renderItem={renderBookCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2A5288']}
            tintColor="#2A5288"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8D5A8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4A4A4A',
    fontWeight: '500',
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
  statsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A5288',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  coverContainer: {
    marginRight: 16,
  },
  cover: {
    width: 95,
    height: 140,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  noCover: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A5288',
    marginBottom: 5,
    lineHeight: 23,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 13,
    color: '#4A4A4A',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  updateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  updateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A5288',
  },
  finishBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  finishBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#27AE60',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A5288',
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 4,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ReadingBooksScreen;