import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import colors from '../../theme/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.header }, // Azul do cabeçalho
        headerTintColor: '#FFF', // Texto branco no cabeçalho
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: colors.background } // Fundo creme padrão
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'MyBookShelf' }} 
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
    </Stack.Navigator>
  );
};

export default AppNavigator;