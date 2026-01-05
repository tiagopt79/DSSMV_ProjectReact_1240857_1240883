import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, SafeAreaView } from 'react-native';

const AppHeader = ({ title = "MyBookShelf", subtitle }) => {
  return (
    <View style={styles.headerContainer}>
      {}
      <StatusBar backgroundColor="#254E70" barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {}
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
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0,

    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
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
    fontWeight: '400',
  }
});

export default AppHeader;