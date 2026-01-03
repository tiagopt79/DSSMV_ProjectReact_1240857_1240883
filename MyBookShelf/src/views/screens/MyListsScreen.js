// src/views/screens/MyListsScreen.js - Design Premium COM NAVEGAÇÃO
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getLists, createList, deleteList } from '../../services/restDbApi';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const MyListsScreen = ({ navigation }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#2A5288');

  const colors = [
    { color: '#2A5288', name: 'Azul' },
    { color: '#E91E63', name: 'Rosa' },
    { color: '#9C27B0', name: 'Roxo' },
    { color: '#F39C12', name: 'Laranja' },
    { color: '#27AE60', name: 'Verde' },
    { color: '#E74C3C', name: 'Vermelho' },
  ];

  const icons = [
    'favorite',
    'star',
    'local-library',
    'schedule',
    'emoji-events',
    'bookmark',
    'auto-stories',
    'menu-book',
  ];

  const [selectedIcon, setSelectedIcon] = useState('list');

  // Carregar listas
  const loadLists = useCallback(async () => {
    try {
      setLoading(true);
      
      // Buscar listas da API
      const listsData = await getLists();
      setLists(listsData);
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
      // Se não houver listas na API, inicializa com array vazio
      setLists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLists();
    setRefreshing(false);
  }, [loadLists]);

  // Criar nova lista
  const handleCreateList = async () => {
    if (!newListName.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para a lista.');
      return;
    }

    try {
      // Criar lista na API
      const newList = await createList({
        name: newListName,
        description: newListDescription,
        color: selectedColor,
        icon: selectedIcon,
      });

      // Atualizar lista local
      setLists([...lists, newList]);
      
      // Resetar formulário
      setModalVisible(false);
      setNewListName('');
      setNewListDescription('');
      setSelectedColor('#2A5288');
      setSelectedIcon('list');
      
      Alert.alert('✅ Criada!', `Lista "${newListName}" criada com sucesso!`);
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      Alert.alert('Erro', 'Não foi possível criar a lista. Verifique sua conexão.');
    }
  };

  // Apagar lista
  const handleDeleteList = (listId, listName) => {
    Alert.alert(
      'Apagar Lista',
      `Tem certeza que deseja apagar "${listName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Apagar da API
              await deleteList(listId);
              
              // Remover da lista local
              setLists(lists.filter(list => list._id !== listId));
              
              Alert.alert('✅ Apagada!', `Lista "${listName}" foi apagada.`);
            } catch (error) {
              console.error('Erro ao apagar lista:', error);
              Alert.alert('Erro', 'Não foi possível apagar a lista.');
            }
          },
        },
      ]
    );
  };

  // Navegar para detalhes da lista
  const handleListPress = (list) => {
    navigation.navigate('ListDetails', {
      listId: list._id,
      listName: list.name,
      listColor: list.color,
      listIcon: list.icon,
      onGoBack: loadLists, // Callback para atualizar quando voltar
    });
  };

  // Renderizar card de lista (Grid 2 colunas)
  const renderListCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.listCard, { borderTopColor: item.color, borderTopWidth: 4 }]}
      onPress={() => handleListPress(item)}
      onLongPress={() => handleDeleteList(item._id, item.name)}
      activeOpacity={0.85}
    >
      {/* Gradiente decorativo de fundo */}
      <View style={[styles.cardGradient, { backgroundColor: item.color + '10' }]} />
      
      {/* Conteúdo */}
      <View style={styles.cardContent}>
        {/* Ícone grande */}
        <View style={[styles.cardIcon, { backgroundColor: item.color + '20' }]}>
          <Icon name={item.icon} size={36} color={item.color} />
        </View>

        {/* Informações */}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>

        {item.description ? (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        {/* Footer com contador */}
        <View style={styles.cardFooter}>
          <View style={[styles.bookBadge, { backgroundColor: item.color + '15' }]}>
            <Icon name="book" size={14} color={item.color} />
            <Text style={[styles.bookBadgeText, { color: item.color }]}>
              {item.bookCount || 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Icon name="playlist-add" size={70} color="#2A5288" />
      </View>
      <Text style={styles.emptyTitle}>Nenhuma Lista Criada</Text>
      <Text style={styles.emptyText}>
        Organize os seus livros criando listas personalizadas!
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.emptyButtonText}>Criar Primeira Lista</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={26} color="#2A5288" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2A5288" />
          <Text style={styles.loadingText}>Carregando listas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#2A5288" />
        </TouchableOpacity>
      </View>

      {/* TÍTULO E BOTÃO CRIAR */}
      <View style={styles.titleSection}>
        <View>
          <Text style={styles.mainTitle}>Minhas Listas</Text>
          <Text style={styles.subtitle}>{lists.length} listas criadas</Text>
        </View>
        <TouchableOpacity style={styles.fabButton} onPress={() => setModalVisible(true)}>
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* GRID DE LISTAS (2 colunas) */}
      <FlatList
        data={lists}
        renderItem={renderListCard}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2A5288']}
            tintColor="#2A5288"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* MODAL CRIAR LISTA */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Lista</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Lista *</Text>
              <TextInput
                style={styles.input}
                value={newListName}
                onChangeText={setNewListName}
                placeholder="Ex: Livros de Verão"
                placeholderTextColor="#AAAAAA"
                maxLength={40}
              />
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newListDescription}
                onChangeText={setNewListDescription}
                placeholder="Adicione uma breve descrição..."
                placeholderTextColor="#AAAAAA"
                multiline
                numberOfLines={2}
                maxLength={100}
              />
            </View>

            {/* Escolher Cor */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Escolher Cor</Text>
              <View style={styles.colorPicker}>
                {colors.map((item) => (
                  <TouchableOpacity
                    key={item.color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: item.color },
                      selectedColor === item.color && styles.colorSelected,
                    ]}
                    onPress={() => setSelectedColor(item.color)}
                  >
                    {selectedColor === item.color && (
                      <Icon name="check" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Escolher Ícone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Escolher Ícone</Text>
              <View style={styles.iconPicker}>
                {icons.map((iconName) => (
                  <TouchableOpacity
                    key={iconName}
                    style={[
                      styles.iconOption,
                      selectedIcon === iconName && styles.iconSelected,
                    ]}
                    onPress={() => setSelectedIcon(iconName)}
                  >
                    <Icon
                      name={iconName}
                      size={24}
                      color={selectedIcon === iconName ? selectedColor : '#666'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Botão Criar */}
            <TouchableOpacity style={styles.createButton} onPress={handleCreateList}>
              <Icon name="check-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.createButtonText}>Criar Lista</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8D5A8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A5288',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2A5288',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#2A5288',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    minHeight: 200,
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  cardContent: {
    padding: 18,
    position: 'relative',
    zIndex: 1,
  },
  cardIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
    lineHeight: 23,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 16,
  },
  cardFooter: {
    marginTop: 'auto',
  },
  bookBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  bookBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#2A5288',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A5288',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A5288',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#2A5288',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2A5288',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2A5288',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#000000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 6,
  },
  iconPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSelected: {
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#2A5288',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A5288',
    paddingVertical: 18,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#2A5288',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyListsScreen;