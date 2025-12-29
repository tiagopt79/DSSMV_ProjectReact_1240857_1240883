import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import books from '../../consts/books'; // Importa os livros de exemplo

const MyListsScreen = ({ navigation }) => {

  const renderBook = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Título da Página */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Listas</Text> 
        {/* Muda "Minha Lista" para "Favoritos", "Desejos", etc. conforme a tela */}
      </View>

      <FlatList 
        data={books} 
        renderItem={renderBook} 
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3E5AB' },
  header: { padding: 20, backgroundColor: '#FFF', elevation: 2 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  bookImage: { width: 80, height: 120 },
  textContainer: { flex: 1, padding: 15, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  author: { fontSize: 14, color: '#666', marginBottom: 5 },
  status: { fontSize: 12, color: '#254E70', fontWeight: 'bold' }
});

// Muda também aqui no export!
export default MyListsScreen;