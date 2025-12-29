import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppHeader from '../components/AppHeader';
import MenuButton from '../components/MenuButton';
import WideButton from '../components/WideButton';

const HomeScreen = ({ navigation }) => {
  
  const handlePress = (screenName) => {
    // 1. Se for "Adicionar Livro", vai para a Pesquisa
    if (screenName === 'Adicionar Livro') {
      navigation.navigate('Search');
    } 
    // 2. Para todos os outros botões, NAVEGA!
    // Isto vai procurar uma tela no AppNavigator com o mesmo nome (ex: "Favoritos")
    else {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <AppHeader title="MyBookShelf" subtitle="Que livro você leu hoje?" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Botão Adicionar (Vai para a Pesquisa) */}
        <TouchableOpacity 
          style={styles.addBookCard} 
          onPress={() => handlePress('Adicionar Livro')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.addBookTitle}>Adicionar um livro</Text>
            <Text style={styles.addBookSubtitle}>Estás a ler algum livro?</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Livros em leitura</Text>
          <Text style={styles.sectionIcon}>📖</Text> 
        </View>

        <View style={styles.emptyReadingList}>
           <Text style={styles.emptyText}>Nenhum livro iniciado.</Text>
        </View>

        {/* Botões Quadrados */}
        <View style={styles.gridContainer}>
          <MenuButton 
            title="Lista de Desejos" 
            icon="♡" 
            onPress={() => handlePress('Lista de Desejos')} 
          />
          <MenuButton 
            title="Favoritos" 
            icon="♥" 
            onPress={() => handlePress('Favoritos')} 
          />
        </View>

        {/* Botões Largos */}
        <View style={styles.listButtonsContainer}>
          <WideButton 
            title="Minha Biblioteca" 
            icon="📚" 
            onPress={() => handlePress('Minha Biblioteca')} 
          />
          <WideButton 
            title="Minhas Listas" 
            icon="✓" 
            onPress={() => handlePress('Minhas Listas')} 
          />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F3E5AB' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  addBookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  addBookTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  addBookSubtitle: { fontSize: 14, color: '#666' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sectionIcon: { fontSize: 20 },
  emptyReadingList: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    height: 100,
    borderRadius: 8,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { color: '#888', fontStyle: 'italic' },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  listButtonsContainer: { marginTop: 5 }
});

export default HomeScreen;