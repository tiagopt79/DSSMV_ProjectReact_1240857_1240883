import React, { useEffect } from 'react';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { searchBooks } from '../../flux/actions/bookActions';
import BookCard from '../components/BookCard';
import colors from '../../theme/colors';

const SearchScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const books = useSelector(state => state.books.searchResults);

  // Carrega os dados "mock" ao abrir a tela (simulando a pesquisa "Lola")
  useEffect(() => {
    dispatch(searchBooks('Lola'));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Pesquisar livros..." 
          defaultValue="Lola"
        />
      </View>

      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookCard 
            book={item} 
            onPress={() => navigation.navigate('BookDetails', { book: item })}
          />
        )}
      />
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
    padding: 10,
    margin: 16,
    borderRadius: 25,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
  },
});

export default SearchScreen;