// src/views/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import WishListScreen from '../screens/WishListScreen';
import MyLibraryScreen from '../screens/MyLibraryScreen';
import MyListsScreen from '../screens/MyListsScreen';
import ReadingBooksScreen from '../screens/ReadingBooksScreen';

import colors from '../../theme/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'MyBookShelf', headerShown: false }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Pesquisar' }} 
      />
      <Stack.Screen 
        name="BookDetails" 
        component={BookDetailsScreen} 
        options={{ title: 'Detalhes do Livro' }} 
      />
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: 'Favoritos' }} 
      />
      <Stack.Screen 
        name="WishList" 
        component={WishListScreen} 
        options={{ title: 'Lista de Desejos' }} 
      />
      <Stack.Screen 
        name="MyLibrary" 
        component={MyLibraryScreen} 
        options={{ title: 'Minha Biblioteca' }} 
      />
      <Stack.Screen 
        name="MyLists" 
        component={MyListsScreen} 
        options={{ title: 'Minhas Listas' }} 
      />
      <Stack.Screen 
        name="ReadingBooks" 
        component={ReadingBooksScreen} 
        options={{ title: 'A Ler' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;