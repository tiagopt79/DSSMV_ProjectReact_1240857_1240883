import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

const SearchBar = ({ value, onChangeText, onSearch, placeholder = "Pesquisar..." }) => {
  return (
    <View style={styles.container}>
      {}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          returnKeyType="search" 
          onSubmitEditing={onSearch}
        />
      </View>

      {}
      <TouchableOpacity style={styles.searchButton} onPress={onSearch} activeOpacity={0.7}>
        {}
        <Text style={styles.iconFallback}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 30, 
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginRight: 10,
    
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  input: {
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#254E70',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  iconFallback: {
    fontSize: 20,
    color: '#FFF',
  }
});

export default SearchBar;
