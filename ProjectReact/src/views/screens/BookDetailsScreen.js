import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AppHeader from '../components/AppHeader';

const BookDetailsScreen = () => {
  
  // Dados simulados (depois virão da navegação)
  const book = {
    title: "Lola",
    author: "Arthur Griffiths",
    coverUrl: "https://www.gutenberg.org/cache/epub/56578/pg56578.cover.medium.jpg", // Imagem de exemplo
    description: "Uma história fascinante sobre..."
  };

  return (
    <View style={styles.container}>
      {/* 1. Cabeçalho com seta de voltar (simulada por enquanto) */}
      <AppHeader title="Detalhes do Livro" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 2. Cartão Principal (Capa e Título) */}
        <View style={styles.mainCard}>
          <Image 
            source={{ uri: book.coverUrl }} 
            style={styles.coverImage} 
            resizeMode="contain"
          />
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>
        </View>

        {/* 3. Botão "Começar a Ler!" */}
        <TouchableOpacity 
          style={styles.readButton}
          onPress={() => Alert.alert('Leitura', 'Abrir leitor...')}
        >
          <Text style={styles.readButtonText}>▶ Começar a Ler!</Text>
        </TouchableOpacity>

        {/* 4. Secção "Adicionar a Estantes" */}
        <Text style={styles.sectionLabel}>Adicionar a Estantes</Text>
        
        <View style={styles.actionsRow}>
          {/* Botão Favoritos (Outline) */}
          <TouchableOpacity style={styles.outlineButton} onPress={() => Alert.alert('Favoritos')}>
            <Text style={styles.outlineButtonText}>📖 Favoritos</Text>
          </TouchableOpacity>

          {/* Botão Wishlist (Outline) */}
          <TouchableOpacity style={styles.outlineButton} onPress={() => Alert.alert('Wishlist')}>
            <Text style={styles.outlineButtonText}>♥ Wishlist</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Minha Biblioteca (Roxo Cheio) */}
        <TouchableOpacity style={styles.libraryButton} onPress={() => Alert.alert('Biblioteca')}>
          <Text style={styles.libraryButtonText}>📚 Adicionar à Minha Biblioteca</Text>
        </TouchableOpacity>

        {/* 5. Sinopse */}
        <Text style={styles.sectionLabel}>Sinopse</Text>
        <Text style={styles.description}>
          {book.description || "No description available."}
        </Text>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5AB', // O Bege clássico
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  coverImage: {
    width: 120,
    height: 180,
    marginBottom: 15,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#254E70',
    textAlign: 'center',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  readButton: {
    backgroundColor: '#254E70', // Azul Escuro
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  readButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#254E70',
    borderRadius: 8,
    paddingVertical: 10,
    width: '48%', // Para ficarem lado a lado
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    color: '#254E70',
    fontWeight: '600',
  },
  libraryButton: {
    backgroundColor: '#9C27B0', // Roxo
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 2,
  },
  libraryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  }
});

export default BookDetailsScreen;