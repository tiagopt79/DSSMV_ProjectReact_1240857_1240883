import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';

const AppHeader = ({ title = "MyBookShelf", subtitle }) => {
  return (
    // ESTA é a View principal que segura tudo (a "caixa" mãe)
    <View style={styles.headerContainer}>
      
      <StatusBar backgroundColor="#254E70" barStyle="light-content" />
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#254E70',
    width: '100%',
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
  },
  content: {
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
  }
});

export default AppHeader;