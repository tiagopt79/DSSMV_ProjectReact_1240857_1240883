// src/views/screens/MyListsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

const MyListsScreen = ({ navigation }) => {
  const [lists, setLists] = useState([
    {
      id: '1',
      name: 'Ficção Científica',
      description: 'Os melhores de sci-fi',
      bookIds: [],
    },
    {
      id: '2',
      name: 'Clássicos Portugueses',
      description: 'Literatura portuguesa',
      bookIds: [],
    },
  ]);

  const handleDeleteList = (listId) => {
    Alert.alert(
      'Confirmar',
      'Tens a certeza que queres eliminar esta lista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setLists(lists.filter(l => l.id !== listId));
          },
        },
      ]
    );
  };

  const handleCreateList = () => {
    const newList = {
      id: Date.now().toString(),
      name: `Lista ${lists.length + 1}`,
      description: 'Nova lista criada',
      bookIds: [],
    };
    setLists([...lists, newList]);
  };

  const renderList = ({ item }) => (
    <View style={styles.listCard}>
      <View style={styles.listInfo}>
        <Text style={styles.listName}>{item.name}</Text>
        <Text style={styles.listDescription}>{item.description}</Text>
        <Text style={styles.bookCount}>{item.bookIds?.length || 0} livros</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteList(item.id)}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Listas 📚</Text>
      </View>

      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.fab} onPress={handleCreateList}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3E5AB' },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  listContainer: { padding: 15 },
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  listInfo: { flex: 1 },
  listName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  listDescription: { fontSize: 14, color: '#666', marginBottom: 5 },
  bookCount: { fontSize: 12, color: '#254E70', fontWeight: 'bold' },
  deleteButton: { padding: 10 },
  deleteIcon: { fontSize: 24 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#254E70',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabText: { fontSize: 32, color: '#FFF', fontWeight: 'bold' },
});

export default MyListsScreen;