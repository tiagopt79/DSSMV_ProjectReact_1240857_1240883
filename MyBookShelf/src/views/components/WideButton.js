import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const WideButton = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        {/* Ícone à esquerda */}
        <Text style={styles.iconText}>{icon}</Text>
        
        {/* Título */}
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%', 
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
    marginRight: 15,
    color: '#6A1B9A',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  }
});

export default WideButton;