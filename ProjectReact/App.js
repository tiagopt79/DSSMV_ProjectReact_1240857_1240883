import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AppNavigator from './src/views/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#254E70' }}>
      <StatusBar backgroundColor="#254E70" barStyle="light-content" />
      <AppNavigator />
    </SafeAreaView>
  );
};

export default App;