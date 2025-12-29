import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import AppHeader from '../components/AppHeader';

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  // 1. A nossa "Base de Dados" falsa (agora com mais livros para testar)
  const allBooks = [
    { id: '1', title: 'Lola', author: 'Arthur Griffiths', cover: 'https://www.gutenberg.org/cache/epub/56578/pg56578.cover.medium.jpg', description: 'Uma história de mistério...' },
    { id: '2', title: 'Dom Casmurro', author: 'Machado de Assis', cover: 'https://www.gutenberg.org/cache/epub/55752/pg55752.cover.medium.jpg', description: 'Capitu traiu Bentinho?' },
    { id: '3', title: 'O Primo Basílio', author: 'Eça de Queirós', cover: 'https://www.gutenberg.org/cache/epub/40409/pg40409.cover.medium.jpg', description: 'Um clássico português.' },
    { id: '4', title: 'Os Maias', author: 'Eça de Queirós', cover: 'https://www.gutenberg.org/cache/epub/52689/pg52689.cover.medium.jpg', description: 'A saga da família Maia.' },
  ];

  // 2. A Mágica do Filtro: Se o texto estiver vazio, mostra tudo. Se não, filtra.
  const filteredBooks = searchText.length > 0
    ? allBooks.filter(book => 
        book.title.toLowerCase().includes(searchText.toLowerCase()) || 
        book.author.toLowerCase().includes(searchText.toLowerCase())
      )
    : allBooks;

  return (
    <View style={styles.container}>
      <AppHeader title="Pesquisar" subtitle="Encontre o seu próximo livro" />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Digite título ou autor..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText} // Atualiza o texto e refaz o filtro automaticamente
        />
      </View>

      <FlatList
        data={filteredBooks} // <--- Agora usamos a lista filtrada!
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        
        // Se a lista estiver vazia (não encontrou nada), mostra mensagem
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum livro encontrado.</Text>
        }

        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.resultItem}
            // 3. Aqui está o segredo do passo seguinte: Enviamos o livro clicado para os detalhes!
            onPress={() => navigation.navigate('BookDetails', { bookData: item })} 
          >
            <Image source={{ uri: item.cover }} style={styles.tinyCover} resizeMode="cover" />
            <View style={styles.textContainer}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3E5AB' },
  searchContainer: { padding: 20, backgroundColor: '#254E70', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  searchInput: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, fontSize: 16, color: '#333' },
  resultItem: { flexDirection: 'row', backgroundColor: '#FFF', padding: 10, marginBottom: 10, borderRadius: 8, elevation: 2 },
  tinyCover: { width: 50, height: 75, marginRight: 15, borderRadius: 4, backgroundColor: '#ddd' },
  textContainer: { flex: 1, justifyContent: 'center' },
  bookTitle: { fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: 4 },
  bookAuthor: { color: '#666', fontSize: 14 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#666', fontSize: 16, fontStyle: 'italic' }
});

export default SearchScreen;