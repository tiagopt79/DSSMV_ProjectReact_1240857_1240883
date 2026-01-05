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
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddBookModal from '../components/AddBookModal';
import { getListById, getBooksFromList, removeBookFromList, deleteList } from '../../services/restDbApi';

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
      
      console.log('\n📋 CARREGANDO DETALHES DA LISTA');
      console.log('listId:', listId);
      console.log('listName:', listName);
      
      let listData = null;
      try {
        listData = await getListById(listId);
        setList(listData);
        console.log('✅ Lista carregada:', listData);
      } catch (listError) {
        console.error('❌ Erro ao buscar lista:', listError.message);
        listData = {
          _id: listId,
          name: listName,
          color: listColor,
          icon: listIcon,
          bookIds: [],
          bookCount: 0,
        };
        setList(listData);
        Alert.alert(
          'Aviso',
          'A lista pode estar com problemas. Mostrando dados básicos.',
          [{ text: 'OK' }]
        );
      }

      if (listData && listData.bookIds && listData.bookIds.length > 0) {
        try {
          console.log(`📚 Buscando ${listData.bookIds.length} livros...`);
          const booksData = await getBooksFromList(listId);
          setBooks(booksData);
          console.log(`✅ ${booksData.length} livros carregados`);
        } catch (booksError) {
          console.error('❌ Erro ao buscar livros:', booksError.message);
          setBooks([]);
          Alert.alert(
            'Aviso',
            'Não foi possível carregar os livros da lista. A lista pode conter livros que foram apagados.',
            [{ text: 'OK' }]
          );
        }
      } else {
        console.log('🔭 Lista vazia');
        setBooks([]);
      }
      
    } catch (error) {
      console.error('❌ Erro geral:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar os detalhes da lista. Tente novamente.',
        [
          { text: 'Voltar', onPress: () => navigation.goBack() },
          { text: 'Tentar novamente', onPress: () => loadListDetails() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadListDetails();
    setRefreshing(false);
  }, [listId]);

  const handleDeleteList = () => {
    Alert.alert(
      'Apagar Lista',
      `Tens certeza que desejas apagar a lista "${listName}"? Todos os livros serão removidos desta lista.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(listId);
              
              Alert.alert(
                'Lista Apagada',
                `A lista "${listName}" foi apagada com sucesso.`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      if (onGoBack) onGoBack();
                      navigation.goBack();
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Erro ao apagar lista:', error);
              Alert.alert('Erro', 'Não foi possível apagar a lista.');
            }
          },
        },
      ]
    );
  };

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
      isNewBook: false,
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
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />
        <ActivityIndicator size="large" color={listColor} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />
      
      {}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            if (onGoBack) onGoBack();
            navigation.goBack();
          }}
        >
          <Icon name="arrow-back" size={26} color="#2C3E50" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleDeleteList}
        >
          <Icon name="delete" size={26} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.listBanner}>
        <View style={styles.listBannerTop}>
          <View style={[styles.iconContainer, { backgroundColor: listColor }]}>
            <Icon name={listIcon} size={32} color="#FFFFFF" />
          </View>
          <View style={styles.listTitleContainer}>
            <Text style={styles.listTitle} numberOfLines={2}>
              {listName}
            </Text>
            <Text style={styles.bookCountBadge}>
              {books.length} {books.length === 1 ? 'livro' : 'livros'}
            </Text>
          </View>
        </View>
        
        {list?.description && (
          <Text style={styles.listDescriptionBanner} numberOfLines={2}>
            {list.description}
          </Text>
        )}
      </View>

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

      {}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: listColor }]}
        onPress={handleAddBooks}
        activeOpacity={0.8}
      >
        <Icon name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#E8D5A8',
  },
  headerButton: {
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
  headerSpace: {
    width: 48,
    height: 48,
    display: 'none',
  },
  listBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  listBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  listTitleContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A5288',
    marginBottom: 6,
    lineHeight: 30,
  },
  bookCountBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7355',
  },
  listDescriptionBanner: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 20,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
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
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default ListDetailsScreen;