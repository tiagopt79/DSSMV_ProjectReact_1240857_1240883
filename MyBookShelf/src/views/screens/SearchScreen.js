import React, { useState } from 'react';
import { 
  View, 
  FlatList, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView, 
  Platform 
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { searchBooks, clearSearchResults } from '../../flux/actions';
import BookCard from '../components/BookCard';
import colors from '../../theme/colors';

const SearchScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Parâmetros que vêm da lista (se existirem)
  const { fromList, listId, listName, listColor } = route.params || {};

  const [query, setQuery] = useState('');
  const { searchResults, loading, error } = useSelector(state => state.books);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(searchBooks(query));
    }
  };

  const handleClear = () => {
    setQuery('');
    dispatch(clearSearchResults());
  };

  const handleBookPress = (book) => {
    // Se veio de uma lista personalizada, vai para LibraryBookDetails
    if (fromList && listId) {
      navigation.navigate('LibraryBookDetails', { 
        book: book,
        fromList: fromList, 
        listId: listId,
        listName: listName,
        isNewBook: true 
      });
    } else {
      // Se não veio de lista (pesquisa normal da home), vai para BookDetails
      navigation.navigate('BookDetails', { 
        book: book
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5288" />
      
      {/* HEADER CORRIGIDO */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          
          {/* Botão Voltar */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
             <MaterialIcons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          
          {/* Caixa de Pesquisa */}
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={24} color="#666" style={{ marginRight: 8 }} />
            
            <TextInput 
              style={styles.input}
              placeholder={fromList ? `Adicionar a: ${listName}` : "Pesquisar título, autor..."}
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="words"
            />
            
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

        </View>

        {/* Banner Opcional (Aparece em baixo do header se vier de uma lista) */}
        {fromList && (
          <View style={[styles.listBanner, { backgroundColor: listColor || '#27AE60' }]}>
              <MaterialIcons name="playlist-add" size={16} color="#fff" />
              <Text style={styles.listBannerText}>Modo de adição: {listName}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2A5288" />
            <Text style={styles.loadingText}>A procurar livros...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id || item.isbn || Math.random().toString()}
          renderItem={({ item }) => (
            <BookCard 
              book={item} 
              onPress={() => handleBookPress(item)} 
              hideStatus={true}
            />
          )}
          contentContainerStyle={{ padding: 16, paddingTop: 20 }}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
               <MaterialIcons name="menu-book" size={60} color="#DDD" />
               <Text style={styles.emptyText}>
                 {error ? error : "Escreve o nome de um livro para começar."}
               </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8D5A8',
  },
  header: {
    backgroundColor: '#2A5288',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 46,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  listBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'center',
  },
  listBannerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  }
});

export default SearchScreen;