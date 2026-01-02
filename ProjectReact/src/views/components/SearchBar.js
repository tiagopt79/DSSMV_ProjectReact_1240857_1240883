import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

// NOTA: Se já tiveres a biblioteca 'react-native-vector-icons' instalada, 
// podes descomentar a linha abaixo e substituir o emoji da lupa pelo Icon.
// import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchBar = ({ value, onChangeText, onSearch, placeholder = "Pesquisar..." }) => {
  return (
    <View style={styles.container}>
      {/* Parte 1: O Campo de Texto Branco */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          // Configurações de teclado
          returnKeyType="search" 
          onSubmitEditing={onSearch} // Ativa a pesquisa ao carregar "Enter" no teclado
        />
      </View>

      {/* Parte 2: O Botão Azul Redondo */}
      <TouchableOpacity style={styles.searchButton} onPress={onSearch} activeOpacity={0.7}>
        {/* Estou a usar um Emoji 🔍 para garantir que o código funciona já.
            O ideal é substituir isto por: <Icon name="search" size={24} color="#FFF" /> */}
        <Text style={styles.iconFallback}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Coloca a input e o botão lado a lado
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    // Cor de fundo transparente para assumir a cor da tela (bege)
  },
  inputWrapper: {
    flex: 1, // Ocupa todo o espaço disponível menos o do botão
    backgroundColor: '#FFFFFF',
    borderRadius: 30, // Arredondamento forte para ficar oval
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginRight: 10, // Espaço entre a input e o botão azul
    
    // Sombra suave
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  input: {
    fontSize: 16,
    color: '#333',
    height: '100%', // Garante que a área clicável é total
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#254E70', // O mesmo Azul do AppHeader
    borderRadius: 25, // Metade da largura/altura para criar um círculo perfeito
    justifyContent: 'center',
    alignItems: 'center',
    
    // Sombra do botão
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  iconFallback: {
    fontSize: 20,
    color: '#FFF', // No emoji não muda a cor, mas num Icon mudaria
  }
});

export default SearchBar;
