import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  TouchableOpacity, 
  SafeAreaView, // Adicionado para proteger contra o notch/barra de status
  StatusBar 
} from 'react-native';

// Certifica-te que estes ficheiros existem mesmo nas pastas corretas!
import AppHeader from '../components/AppHeader';
import MenuButton from '../components/MenuButton';
import WideButton from '../components/WideButton';

const HomeScreen = ({ navigation }) => { // Recebe "navigation" se estiveres a usar React Navigation
  
  const handlePress = (screenName) => {
    // Se já tiveres a navegação configurada, trocas o Alert por:
    // navigation.navigate(screenName);
    Alert.alert('Navegação', `A ir para: ${screenName}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3E5AB" />
      
      <View style={styles.mainContainer}>
        {/* 1. O Cabeçalho */}
        <AppHeader 
          title="MyBookShelf" 
          subtitle="Que livro você leu hoje?" 
        />

        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false} // Remove a barra de scroll feia
        >
          
          {/* 2. Cartão "Adicionar um livro" */}
          <TouchableOpacity 
            style={styles.addBookCard} 
            onPress={() => handlePress('AddBook')} // Nome da rota (exemplo)
            activeOpacity={0.8}
          >
            <View>
              <Text style={styles.addBookTitle}>Adicionar um livro</Text>
              <Text style={styles.addBookSubtitle}>Estás a ler algum livro novo?</Text>
            </View>
            {/* Dica: Podes adicionar aqui um ícone de "+" no futuro */}
          </TouchableOpacity>

          {/* 3. Secção "Livros em leitura" */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Livros em leitura</Text>
            <Text style={styles.sectionIcon}>📖</Text> 
          </View>

          {/* Placeholder vazio */}
          <View style={styles.emptyReadingList}>
             <Text style={styles.emptyText}>Nenhum livro iniciado.</Text>
          </View>

          {/* 4. Grelha de Botões (Lista de Desejos + Favoritos) */}
          <View style={styles.gridContainer}>
            <MenuButton 
              title="Lista de Desejos" 
              icon="♡" 
              onPress={() => handlePress('Wishlist')} 
            />
            <MenuButton 
              title="Favoritos" 
              icon="♥" 
              onPress={() => handlePress('Favorites')} 
            />
          </View>

          {/* 5. Botões Largos */}
          <View style={styles.listButtonsContainer}>
            <WideButton 
              title="Minha Biblioteca" 
              icon="📚" 
              onPress={() => handlePress('Library')} 
            />
            <WideButton 
              title="Minhas Listas" 
              icon="✓" 
              onPress={() => handlePress('MyLists')} 
            />
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3E5AB', // Cor de fundo da SafeArea para bater certo com a app
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F3E5AB',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  // Estilo do Cartão "Adicionar Livro"
  addBookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Arredondei um pouco mais para ficar moderno
    padding: 20,
    marginBottom: 20,
    // Sombra suave
    elevation: 4, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  addBookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50', // Cor de texto mais suave que preto puro
    marginBottom: 4,
  },
  addBookSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  // Estilos das Secções
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255, 0.6)', // Ligeiramente transparente
    padding: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
  sectionIcon: {
    fontSize: 18,
  },
  emptyReadingList: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderStyle: 'dashed', // Borda tracejada fica bem em placeholders
    borderWidth: 1,
    borderColor: '#BDC3C7',
    height: 80,
    borderRadius: 8,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  // Grelha
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15, // Mais espaço entre a grelha e os botões de baixo
  },
  listButtonsContainer: {
    gap: 10, // (Funciona em React Native mais recente) Dá espaço automático entre botões verticais
  }
});

export default HomeScreen;