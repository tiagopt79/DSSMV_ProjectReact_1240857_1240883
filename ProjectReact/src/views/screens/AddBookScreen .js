// src/views/screens/AddBookScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addBook } from '../../flux/actions';
import { searchBooksByTitle } from '../../flux/actions';

const AddBookScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchBooksByTitle(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching books:', error);
    }
    setLoading(false);
  };

  const handleAddBook = async (bookInfo) => {
    try {
      const bookData = {
        isbn: bookInfo.isbn,
        title: bookInfo.title,
        author: bookInfo.author,
        cover: bookInfo.cover,
        pages: bookInfo.pages || 0,
        currentPage: 0,
        status: 'wishlist',
        isFavorite: false,
        publisher: bookInfo.publisher,
        publishYear: bookInfo.publishYear,
      };
      
      await dispatch(addBook(bookData));
      setModalVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Erro ao adicionar livro. Tente novamente.');
    }
  };

  const openBarcodeScanner = () => {
    // Aqui vais integrar a câmara para scan de ISBN
    // Por agora, vou deixar um placeholder
    alert('Funcionalidade de scan de código de barras será implementada');
    // navigation.navigate('BarcodeScanner');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Adicionar um livro</Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.optionIcon}>🔍</Text>
          <Text style={styles.optionTitle}>Por pesquisa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={openBarcodeScanner}
        >
          <Text style={styles.optionIcon}>📷</Text>
          <Text style={styles.optionTitle}>Por código de barras</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pesquisar Livro</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Digite o título ou autor"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.searchButtonText}>Buscar</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#254E70" />
            ) : (
              <ScrollView style={styles.resultsContainer}>
                {searchResults.map((book, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.resultItem}
                    onPress={() => handleAddBook(book)}
                  >
                    {book.cover && (
                      <Image
                        source={{ uri: book.cover }}
                        style={styles.resultCover}
                      />
                    )}
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultTitle}>{book.title}</Text>
                      <Text style={styles.resultAuthor}>{book.author}</Text>
                      {book.pages > 0 && (
                        <Text style={styles.resultPages}>
                          {book.pages} páginas
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#254E70',
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#254E70',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#254E70',
    marginBottom: 30,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F4F8',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#254E70',
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#254E70',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#254E70',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  resultsContainer: {
    maxHeight: 400,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  resultCover: {
    width: 60,
    height: 90,
    borderRadius: 5,
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  resultAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  resultPages: {
    fontSize: 12,
    color: '#999',
  },
});

export default AddBookScreen;