import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- 1. IMPORTAR TODAS AS TELAS ---
// Certifica-te que estes ficheiros existem na pasta 'src/views/screens/'
import HomeScreen from '../screens/HomeScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import SearchScreen from '../screens/SearchScreen';

// Telas das Listas (Novas)
import FavoritesScreen from '../screens/FavoritesScreen';
import WishListScreen from '../screens/WishListScreen';
import MyLibraryScreen from '../screens/MyLibraryScreen';
import MyListsScreen from '../screens/MyListsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false // Esconde o cabeçalho padrão em todas as telas
        }}
      >
        {/* --- TELA PRINCIPAL --- */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* --- TELAS SECUNDÁRIAS --- */}
        <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />

        {/* --- TELAS DAS LISTAS (Crucial para os botões funcionarem) --- */}
        {/* O 'name' aqui tem de ser IGUALzinho ao que está no HomeScreen */}

        <Stack.Screen name="Minha Biblioteca" component={MyLibraryScreen} />
        
        <Stack.Screen name="Favoritos" component={FavoritesScreen} />
        
        <Stack.Screen name="Lista de Desejos" component={WishListScreen} />
        
        <Stack.Screen name="Minhas Listas" component={MyListsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;