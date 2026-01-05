import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { searchByTitle } from '../../services/googleBooksApi';
import BookCard from '../components/BookCard';
import colors from '../../theme/colors';

const SearchScreen = ({ route, navigation }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const fromList = route.params?.fromList || false;
  const listId = route.params?.listId || null;
  const listName = route.params?.listName || null;

  console.log('📚 SearchScreen - Params recebidos:');
  console.log('  - fromList:', fromList);
  console.log('  - listId:', listId);
  console.log('  - listName:', listName);

  useEffect(() => {
    handleSearch('Harry Potter');
  }, []);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;
    
    setHasSearched(true);
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchByTitle(query);
      setSearchResults(results);
    } catch (err) {
      setError(err.message || 'Erro ao buscar livros');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setSearchResults([]);
  };

  const handleBookPress = (book) => {
    console.log('📖 Livro clicado:', book.title);
    console.log('📋 fromList:', fromList);

    if (fromList) {
      console.log('🟢 Navegando para LibraryBookDetailsScreen para adicionar à lista...');
      
      navigation.navigate('LibraryBookDetails', { 
        book: book,
        fromList: true,
        listId: listId,
        listName: listName,
        isNewBook: true,
      });
    } else {
      console.log('🔵 Navegando para BookDetailsScreen (comportamento normal)');
      
      navigation.navigate('BookDetails', { 
        book: book,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5288" />
      
      {}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Icon name="search" size={28} color="#FFFFFF" style={styles.headerIcon} />
            <View>
              <Text style={styles.headerTitle}>Pesquisar</Text>
              <Text style={styles.headerSubtitle}>
                {fromList ? `Adicionar a ${listName}` : 'Encontra o teu próximo livro'}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerSpace} />
        </View>
      </View>

      {}
      {fromList && listName && (
        <View style={styles.listBanner}>
          <Icon name="playlist-add" size={20} color="#FFFFFF" />
          <Text style={styles.listBannerText}>
            Toca num livro para adicionar à lista
          </Text>
        </View>
      )}

      {}
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Pesquisar livros por título..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearSearch}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>A procurar livros...</Text>
        </View>
      )}

      {}
      {error && !loading && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>⚠ {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => handleSearch()}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {}
      {!loading && !error && (
        <>
          {searchResults.length === 0 && hasSearched ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                Nenhum livro encontrado para "{searchQuery}"
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultsCount}>
                {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'}
              </Text>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <BookCard 
                    book={item} 
                    onPress={() => handleBookPress(item)}
                    hideStatus={true}
                  />
                )}
                contentContainerStyle={styles.listContent}
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: '#2A5288',
    paddingBottom: 16,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  headerSpace: {
    width: 48,
    height: 48,
  },
  listBanner: {
    backgroundColor: '#27AE60',
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  listBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchContainer: {
    backgroundColor: '#FFF',
    padding: 12,
    margin: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default SearchScreen;