// App.js - SEM React Navigation, SEM Redux
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

// Screens
import HomeScreen from './src/views/screens/HomeScreen';
import SearchScreen from './src/views/screens/SearchScreen';
import AddBookScreen from './src/views/screens/AddBookScreen';
import BarcodeScannerScreen from './src/views/screens/BarcodeScannerScreen';
import BookDetailsScreen from './src/views/screens/BookDetailsScreen';
import MyLibraryScreen from './src/views/screens/MyLibraryScreen';
import MyListsScreen from './src/views/screens/MyListsScreen';
import ReadingBooksScreen from './src/views/screens/ReadingBooksScreen';
import WishListScreen from './src/views/screens/WishListScreen';
import FavoritesScreen from './src/views/screens/FavoritesScreen';
import BookProgressScreen from './src/views/screens/BookProgressScreen';

const App = () => {
  // Estado de navegação
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [screenParams, setScreenParams] = useState({});
  const [screenStack, setScreenStack] = useState(['Home']);

  // Função de navegação
  const navigate = (screenName, params = {}) => {
    setCurrentScreen(screenName);
    setScreenParams(params);
    setScreenStack([...screenStack, screenName]);
  };

  // Função de voltar
  const goBack = () => {
    if (screenStack.length > 1) {
      const newStack = screenStack.slice(0, -1);
      setScreenStack(newStack);
      setCurrentScreen(newStack[newStack.length - 1]);
      setScreenParams({});
    }
  };

  // Props comuns para todas as screens
  const navigationProps = {
    navigation: { navigate, goBack },
    route: { params: screenParams },
  };

  // Renderizar a screen atual
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen {...navigationProps} />;
      
      case 'Search':
        return <SearchScreen {...navigationProps} />;
      
      case 'AddBook':
        return <AddBookScreen {...navigationProps} />;
      
      case 'BarcodeScanner':
        return <BarcodeScannerScreen {...navigationProps} />;
      
      case 'BookDetails':
        return <BookDetailsScreen {...navigationProps} />;
      
      case 'MyLibrary':
        return <MyLibraryScreen {...navigationProps} />;
      
      case 'MyLists':
        return <MyListsScreen {...navigationProps} />;
      
      case 'ReadingBooks':
        return <ReadingBooksScreen {...navigationProps} />;
      
      case 'WishList':
        return <WishListScreen {...navigationProps} />;
      
      case 'Favorites':
        return <FavoritesScreen {...navigationProps} />;
        
      case 'BookProgress':
        return <BookProgressScreen {...navigationProps} />;
      
      default:
        return <HomeScreen {...navigationProps} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#254E70" />
      {renderScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5AB',
  },
});

export default App;