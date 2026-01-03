// src/views/screens/SearchScreen.js - SEM Redux
import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator,
  Text,
  TouchableOpacity 
} from 'react-native';
import { searchByTitle } from '../../services/openLibraryApi';
import BookCard from '../components/BookCard';
import colors from '../../theme/colors';

const SearchScreen = ({ navigation }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Busca inicial ao carregar
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

  return (
    <View style={styles.container}>
      {/* Barra de pesquisa */}
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

      {/* Loading */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>A procurar livros...</Text>
        </View>
      )}

      {/* Error */}
      {error && !loading && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => handleSearch()}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Resultados */}
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
                    onPress={() => navigation.navigate('BookDetails', { book: item })}
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