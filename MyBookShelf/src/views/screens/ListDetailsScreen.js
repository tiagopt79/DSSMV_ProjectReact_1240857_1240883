import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddBookModal from '../components/AddBookModal';
import { getListById, getBooksFromList, removeBookFromList } from '../../services/restDbApi';

const ListDetailsScreen = ({ route, navigation }) => {
  const { listId, listName, listColor, listIcon, onGoBack } = route.params;
  
  const [list, setList] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadListDetails();
  }, [listId]);

  const loadListDetails = async () => {
    try {
      setLoading(true);
      
      const listData = await getListById(listId);
      setList(listData);

      if (listData.bookIds && listData.bookIds.length > 0) {
        const booksData = await getBooksFromList(listId);
        setBooks(booksData);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da lista');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadListDetails();
    setRefreshing(false);
  }, [listId]);

  const handleRemoveBook = async (bookId, bookTitle) => {
    Alert.alert(
      'Remover Livro',
      `Remover "${bookTitle}" desta lista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeBookFromList(listId, bookId);
              setBooks(books.filter(book => book._id !== bookId));
              
              if (list) {
                setList({ ...list, bookCount: books.length - 1 });
              }
              
              Alert.alert('Removido', 'Livro removido da lista');
            } catch (error) {
              console.error('Erro ao remover livro:', error);
              Alert.alert('Erro', 'Não foi possível remover o livro');
            }
          },
        },
      ]
    );
  };

  const handleAddBooks = () => {
    setShowAddModal(true);
  };

  const handleSearchBooks = () => {
    setShowAddModal(false);
    navigation.navigate('Search', {
      fromList: true,
      listId: listId,
      listName: listName,
      listColor: listColor,
    });
  };

  const handleScanISBN = () => {
    setShowAddModal(false);
    navigation.navigate('BarcodeScanner', {
      fromList: true,
      listId: listId,
      listName: listName,
      listColor: listColor,
    });
  };

  const handleBookPress = (book) => {
    navigation.navigate('LibraryBookDetails', {
      book: book,
      fromList: true,
      listId: listId,
      listName: listName,
      listColor: listColor,
    });
  };

  const renderBookCard = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => handleBookPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.coverUrl || item.cover || 'https://via.placeholder.com/60x90' }}
        style={styles.bookCover}
        resizeMode="cover"
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveBook(item._id, item.title)}
      >
        <Icon name="close" size={20} color="#8B7355" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: listColor + '15' }]}>
        <Icon name={listIcon} size={48} color={listColor} />
      </View>
      <Text style={styles.emptyTitle}>Lista vazia</Text>
      <Text style={styles.emptyText}>
        Adiciona livros à tua lista para começar
      </Text>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: listColor }]}
        onPress={handleAddBooks}
      >
        <Icon name="add" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Adicionar livros</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={listColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (onGoBack) onGoBack();
            navigation.goBack();
          }}
        >
          <Icon name="arrow-back" size={24} color="#2A5288" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={[styles.iconBadge, { backgroundColor: listColor + '20' }]}>
            <Icon name={listIcon} size={20} color={listColor} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {listName}
            </Text>
            <Text style={styles.headerSubtitle}>
              {books.length} {books.length === 1 ? 'livro' : 'livros'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addHeaderButton}
          onPress={handleAddBooks}
        >
          <Icon name="add" size={24} color="#2A5288" />
        </TouchableOpacity>
      </View>

      {list?.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{list.description}</Text>
        </View>
      )}

      <FlatList
        data={books}
        renderItem={renderBookCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[
          styles.listContent,
          books.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[listColor]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <AddBookModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSearchPress={handleSearchBooks}
        onScanPress={handleScanISBN}
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
    backgroundColor: '#E8D5A8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#F5E6C8',
    borderBottomWidth: 1,
    borderBottomColor: '#D4C3A3',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2A5288',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8B7355',
  },
  addHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    backgroundColor: '#F5E6C8',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4C3A3',
  },
  descriptionText: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4C3A3',
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 6,
    backgroundColor: '#E8D5A8',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2A5288',
    marginBottom: 4,
    lineHeight: 20,
  },
  bookAuthor: {
    fontSize: 13,
    color: '#8B7355',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5E6C8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2A5288',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ListDetailsScreen;