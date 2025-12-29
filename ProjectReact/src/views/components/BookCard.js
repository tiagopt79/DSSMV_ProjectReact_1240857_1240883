import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const BookCard = ({ title, author, coverUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.7}>
      {/* 1. Imagem da Capa (Lado Esquerdo) */}
      <Image 
        source={{ uri: coverUrl }} 
        style={styles.coverImage} 
        resizeMode="cover" // Garante que a imagem preenche o espaço sem distorcer
      />

      {/* 2. Informações do Livro (Lado Direito) */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {author}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row', // Coloca imagem e texto lado a lado
    backgroundColor: '#FFFFFF',
    borderRadius: 8, // Cantos arredondados como nas fotos
    padding: 10,
    marginVertical: 6, // Espaço entre um card e outro na lista
    marginHorizontal: 16, // Margem lateral para não colar na borda do ecrã
    
    // Sombra para Android (elevation) e iOS (shadow properties)
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coverImage: {
    width: 60,   // Tamanho fixo para alinhar a lista
    height: 90,
    borderRadius: 4,
    backgroundColor: '#eee', // Cor de fundo enquanto a imagem carrega
  },
  infoContainer: {
    flex: 1, // Ocupa o resto do espaço disponível à direita
    justifyContent: 'center', // Centraliza o texto verticalmente
    marginLeft: 12, // Espaço entre a imagem e o texto
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666', // Cinzento para destacar menos que o título
  }
});

export default BookCard;
