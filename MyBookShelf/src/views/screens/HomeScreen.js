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
      
      {}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MyBookShelf</Text>
        <Text style={styles.headerSubtitle}>Que livro você leu hoje?</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
       {}
      <AddBookModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSearchPress={handleSearchPress}
        onScanPress={handleScanPress}
      />
      
        {}
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

        {}
        <TouchableOpacity 
          style={styles.wideButton}
          onPress={() => navigation.navigate('ReadingBooks')}
          activeOpacity={0.8}
        >
          <Icon name="menu-book" size={28} color="#000000" style={styles.wideButtonIcon} />
          <Text style={styles.wideButtonText}>Livros em leitura</Text>
        </TouchableOpacity>

        {}
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

        {}
        <TouchableOpacity 
          style={styles.wideButton}
          onPress={() => navigation.navigate('MyLibrary')}
          activeOpacity={0.8}
        >
          <Icon name="library-books" size={28} color="#000000" style={styles.wideButtonIcon} />
          <Text style={styles.wideButtonText}>Minha Biblioteca</Text>
        </TouchableOpacity>

        {}
        <TouchableOpacity 
          style={styles.wideButton}
          onPress={() => navigation.navigate('MyLists')}
          activeOpacity={0.8}
        >
          <Icon name="list" size={28} color="#000000" style={styles.wideButtonIcon} />
          <Text style={styles.wideButtonText}>Minhas Listas</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8D5A8', 
  },
  header: {
    backgroundColor: '#2A5288',
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 20,
    elevation: 10, 
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2A5288',
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
    color: '#000000',
    marginBottom: 4,
  },
  addBookSubtitle: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 18,
  },
  wideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 22,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  wideButtonIcon: {
    marginRight: 16,
  },
  wideButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  menuGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  menuCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    minHeight: 150,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
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
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;