import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { toggleFavorite, addToLibrary } from '../../flux/actions/bookActions';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const BookDetailsScreen = ({ route }) => {
  const { book } = route.params;
  const dispatch = useDispatch();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: book.cover }} style={styles.cover} resizeMode="contain" />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
      </View>

      {/* Botão Azul - Começar a Ler */}
      <TouchableOpacity style={styles.blueButton}>
        <Ionicons name="play" size={20} color="#FFF" style={{marginRight: 8}} />
        <Text style={styles.blueButtonText}>Começar a Ler!</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Adicionar a Estantes</Text>

      {/* Botões de Ação Rápida */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.outlineButton}
          onPress={() => dispatch(toggleFavorite(book))}
        >
          <Ionicons name="heart-outline" size={20} color={colors.text} />
          <Text style={styles.outlineText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton}>
          <Ionicons name="list" size={20} color={colors.text} />
          <Text style={styles.outlineText}>Wishlist</Text>
        </TouchableOpacity>
      </View>

      {/* Botão Roxo - Adicionar à Biblioteca */}
      <TouchableOpacity 
        style={styles.purpleButton}
        onPress={() => dispatch(addToLibrary(book))}
      >
        <Ionicons name="library" size={20} color="#FFF" style={{marginRight: 10}} />
        <Text style={styles.purpleButtonText}>Adicionar à Minha Biblioteca</Text>
      </TouchableOpacity>

      <View style={styles.synopsisContainer}>
        <Text style={styles.sectionHeader}>Sinopse</Text>
        <Text style={styles.synopsisText}>
          {book.description || "No description available."}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  cover: { width: 120, height: 180, marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.header, textAlign: 'center' },
  author: { fontSize: 16, color: '#666', marginTop: 5 },
  
  blueButton: {
    backgroundColor: '#2D4059', // Azul Escuro do print
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  blueButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  outlineButton: {
    flex: 0.48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFF'
  },
  outlineText: { marginLeft: 8, color: '#333' },

  purpleButton: {
    backgroundColor: '#8E24AA', // Roxo vibrante do print
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  purpleButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  synopsisText: { color: '#555', lineHeight: 22 },
  synopsisContainer: { marginBottom: 40 },
});

export default BookDetailsScreen;