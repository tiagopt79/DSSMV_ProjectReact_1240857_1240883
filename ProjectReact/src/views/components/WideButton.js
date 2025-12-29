import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const WideButton = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 30, alignItems: 'center', marginRight: 15 },
  icon: { fontSize: 20, color: '#6A1B9A' },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  arrow: { fontSize: 24, color: '#999', fontWeight: 'bold', marginBottom: 4 }
});

export default WideButton;