import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const MenuButton = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: { marginBottom: 8 },
  iconText: { fontSize: 28, color: '#6A1B9A' },
  title: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' }
});

export default MenuButton;