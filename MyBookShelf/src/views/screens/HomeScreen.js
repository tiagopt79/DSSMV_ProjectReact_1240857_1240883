// src/views/screens/HomeScreen.js - Cores Mais Fortes para Contraste
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddBookModal from '../components/AddBookModal';
import colors from '../../theme/colors';

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddBookPress = () => {
    setModalVisible(true);
  };

  const handleSearchPress = () => {
    setModalVisible(false);
    navigation.navigate('Search');
  };

  const handleScanPress = () => {
    setModalVisible(false);
    navigation.navigate('BarcodeScanner');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5288" />
      
      {/* Header - Azul mais forte */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MyBookShelf</Text>
        <Text style={styles.headerSubtitle}>Que livro você leu hoje?</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Adicionar Livro Card */}
        <TouchableOpacity 
          style={styles.addBookCard}
          onPress={handleAddBookPress}
          activeOpacity={0.8}
        >
          <View style={styles.iconCircle}>
            <Icon name="add-circle" size={32} color="#fff" />
          </View>
          <View style={styles.addBookText}>
            <Text style={styles.addBookTitle}>Adicionar um livro</Text>
            <Text style={styles.addBookSubtitle}>Estas a ler algum livro?</Text>
          </View>
        </TouchableOpacity>

        {/* Livros em Leitura */}
        <TouchableOpacity 
          style={styles.wideButton}
          onPress={() => navigation.navigate('ReadingBooks')}
          activeOpacity={0.8}
        >
          <Icon name="menu-book" size={28} color="#000000" style={styles.wideButtonIcon} />
          <Text style={styles.wideButtonText}>Livros em leitura</Text>
        </TouchableOpacity>

        {/* Menu Grid - 2 Colunas */}
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('WishList')}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: colors.secondary + '25' }]}>
              <Icon name="favorite" size={38} color={colors.secondary} />
            </View>
            <Text style={styles.menuCardText}>Lista de Desejos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Favorites')}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: colors.secondary + '25' }]}>
              <Icon name="bookmark" size={38} color={colors.secondary} />
            </View>
            <Text style={styles.menuCardText}>Favoritos</Text>
          </TouchableOpacity>
        </View>

        {/* Minha Biblioteca */}
        <TouchableOpacity 
          style={styles.wideButton}
          onPress={() => navigation.navigate('MyLibrary')}
          activeOpacity={0.8}
        >
          <Icon name="library-books" size={28} color="#000000" style={styles.wideButtonIcon} />
          <Text style={styles.wideButtonText}>Minha Biblioteca</Text>
        </TouchableOpacity>

        {/* Minhas Listas */}
        <TouchableOpacity 
          style={styles.wideButton}
          onPress={() => navigation.navigate('MyLists')}
          activeOpacity={0.8}
        >
          <Icon name="list" size={28} color="#000000" style={styles.wideButtonIcon} />
          <Text style={styles.wideButtonText}>Minhas Listas</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Adicionar Livro */}
      <AddBookModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSearchPress={handleSearchPress}
        onScanPress={handleScanPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8D5A8', // Bege mais escuro que #F5ECCC para mais contraste
  },
  header: {
    backgroundColor: '#2A5288', // blue_primary - Azul mais forte que o colors.primary
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 20,
    elevation: 10, // Sombra ainda mais forte
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4, // Mais opaca
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 36, // Maior
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF', // Branco puro em vez de rgba
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  addBookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Branco puro
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 8, // Sombra mais forte
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // Mais opaca
    shadowRadius: 6,
    borderWidth: 1.5, // Borda mais grossa
    borderColor: 'rgba(0, 0, 0, 0.08)', // Borda mais visível
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2A5288', // blue_primary - mais forte
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 4,
  },
  addBookText: {
    flex: 1,
  },
  addBookTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000000', // Preto puro
    marginBottom: 4,
  },
  addBookSubtitle: {
    fontSize: 14,
    color: '#4A4A4A', // gray_4A4 - mais escuro que #666
    lineHeight: 18,
  },
  wideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Branco puro
    paddingVertical: 20,
    paddingHorizontal: 22,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 8, // Sombra mais forte
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // Mais opaca
    shadowRadius: 6,
    borderWidth: 1.5, // Borda mais grossa
    borderColor: 'rgba(0, 0, 0, 0.08)', // Borda mais visível
  },
  wideButtonIcon: {
    marginRight: 16,
  },
  wideButtonText: {
    fontSize: 18,
    fontWeight: '700', // Bold mais forte
    color: '#000000', // Preto puro
    flex: 1,
  },
  menuGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  menuCard: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Branco puro
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8, // Sombra mais forte
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // Mais opaca
    shadowRadius: 6,
    minHeight: 150,
    borderWidth: 1.5, // Borda mais grossa
    borderColor: 'rgba(0, 0, 0, 0.08)', // Borda mais visível
  },
  menuIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  menuCardText: {
    fontSize: 15,
    fontWeight: '700', // Bold mais forte
    color: '#000000', // Preto puro
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;