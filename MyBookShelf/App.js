import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Provider } from 'react-redux'; // Importar o Provider
import store from './src/flux/store';   // Importar a Store que já existe

// Screens
import HomeScreen from './src/views/screens/HomeScreen';
import SearchScreen from './src/views/screens/SearchScreen';
import AddBookScreen from './src/views/screens/AddBookScreen';
import BarcodeScannerScreen from './src/views/screens/BarcodeScannerScreen';
import BookDetailsScreen from './src/views/screens/BookDetailsScreen';
import MyLibraryScreen from './src/views/screens/MyLibraryScreen';
import MyListsScreen from './src/views/screens/MyListsScreen';
import ListDetailsScreen from './src/views/screens/ListDetailsScreen';
import ReadingBooksScreen from './src/views/screens/ReadingBooksScreen';
import WishListScreen from './src/views/screens/WishListScreen';
import FavoritesScreen from './src/views/screens/FavoritesScreen';
import BookProgressScreen from './src/views/screens/BookProgressScreen';
import LibraryBookDetailsScreen from './src/views/screens/LibraryBookDetailsScreen';


const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [screenParams, setScreenParams] = useState({});
  const [navigationHistory, setNavigationHistory] = useState([
    { screen: 'Home', params: {} }
  ]);

  const navigate = (screenName, params = {}) => {
    console.log('🚀 Navegando para:', screenName, 'com params:', params);
    setCurrentScreen(screenName);
    setScreenParams(params);
    setNavigationHistory([...navigationHistory, { screen: screenName, params }]);
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      const previous = newHistory[newHistory.length - 1];
      
      console.log('⬅️ Voltando para:', previous.screen);
      setNavigationHistory(newHistory);
      setCurrentScreen(previous.screen);
      setScreenParams(previous.params);
    }
  };

  const navigationProps = {
    navigation: { navigate, goBack },
    route: { params: screenParams },
  };

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
      case 'LibraryBookDetails':
        return <LibraryBookDetailsScreen {...navigationProps} />;
      case 'MyLibrary':
        return <MyLibraryScreen {...navigationProps} />;
      case 'MyLists':
        return <MyListsScreen {...navigationProps} />;
      case 'ListDetails':
        return <ListDetailsScreen {...navigationProps} />;
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

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5AB',
  },
});

export default App;