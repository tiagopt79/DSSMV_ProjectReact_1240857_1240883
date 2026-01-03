import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const MenuButton = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Círculo do ícone (simulado) */}
      <View style={styles.iconContainer}>
        {/* Aqui usaremos o ícone real depois. Por agora é um texto emoji */}
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '48%', // Ocupa quase metade da tela (para ficarem 2 lado a lado)
    padding: 15,
    borderRadius: 12,
    alignItems: 'center', // Centraliza tudo
    justifyContent: 'center',
    marginBottom: 15,

    // Sombra
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    marginBottom: 8,
  },
  iconText: {
    fontSize: 28, // Tamanho do ícone/emoji
    color: '#6A1B9A', // Roxo, cor da tua app
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  }
});

export default MenuButton;