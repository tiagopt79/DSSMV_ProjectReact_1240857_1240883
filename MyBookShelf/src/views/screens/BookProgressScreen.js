import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { updateReadingProgress } from '../../flux/actions';
import colors from '../../theme/colors';

// Importar API diretamente apenas para ler o histórico (leitura não precisa de estar no Redux store global)
import { getReadingSessions } from '../../services/restDbApi';

const BookProgressScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { book: initialBook } = route.params;

  // 1. Ligar ao Redux para ter sempre os dados mais frescos do livro
  const book = useSelector(state => 
    state.books.books.find(b => b._id === initialBook._id) || initialBook
  );

  const totalPages = book.pages || book.pageCount || 0;
  const current = book.current_page || book.currentPage || 0;

  // Estados locais
  const [currentPage, setCurrentPage] = useState(current > 0 ? current.toString() : '');
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carregar histórico ao abrir
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      // Busca sessões à API (não precisamos disto no Redux global, é específico deste ecrã)
      const sessions = await getReadingSessions(book._id);
      setHistory(sessions || []);
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const calculatePercentage = () => {
    const pageNum = parseInt(currentPage || current);
    if (!totalPages || isNaN(pageNum)) return 0;
    return Math.min(Math.round((pageNum / totalPages) * 100), 100);
  };

  const handleSave = async () => {
    const pageNum = parseInt(currentPage);

    if (isNaN(pageNum)) {
      Alert.alert('Erro', 'Insira um número de página válido.');
      return;
    }

    if (totalPages > 0 && pageNum > totalPages) {
      Alert.alert('Aviso', `O livro só tem ${totalPages} páginas!`);
      return;
    }

    if (pageNum < current) {
      Alert.alert('Aviso', 'A página nova deve ser maior que a anterior.');
      return;
    }

    try {
      setSaving(true);
      // Dispara a action do Redux
      await dispatch(updateReadingProgress(book._id, pageNum, totalPages, notes));

      Alert.alert('Sucesso', 'Progresso registado!', [
        { 
          text: 'OK', 
          onPress: () => {
            setNotes(''); // Limpa as notas
            loadHistory(); // Atualiza a lista de histórico
            
            // Se terminou o livro, volta para trás
            if (pageNum >= totalPages) {
                navigation.goBack();
            }
          } 
        }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível guardar o progresso.');
    } finally {
      setSaving(false);
    }
  };

  const percentage = calculatePercentage();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2A5288" />
      
      {/* HEADER (Estilo consistente com a app) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registar Leitura</Text>
        <View style={{ width: 48 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* INFO DO LIVRO */}
        <View style={styles.bookInfo}>
          <Image 
            source={{ uri: book.cover || book.thumbnail || 'https://via.placeholder.com/100' }} 
            style={styles.cover} 
          />
          <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
          <Text style={styles.currentStatusText}>
             Atualmente na página {current} de {totalPages}
          </Text>
        </View>

        {/* CARD INPUT */}
        <View style={styles.card}>
          <Text style={styles.label}>Em que página estás hoje?</Text>
          
          <View style={styles.pageInputContainer}>
            <TextInput
              style={styles.pageInput}
              value={currentPage}
              onChangeText={setCurrentPage}
              keyboardType="number-pad"
              placeholder={current.toString()}
              maxLength={5}
            />
            <Text style={styles.totalText}>/ {totalPages || '?'} páginas</Text>
          </View>

          {/* BARRA DE PROGRESSO VISUAL */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.percentageText}>{percentage}% Lido</Text>
        </View>

        {/* CARD NOTAS */}
        <View style={styles.card}>
          <Text style={styles.label}>Notas da sessão (opcional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="O que achaste desta parte? Escreve aqui..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* CARD HISTÓRICO */}
        <View style={styles.card}>
          <Text style={styles.label}>Histórico de Leitura</Text>
          {loadingHistory ? (
            <ActivityIndicator color="#2A5288" style={{ marginTop: 10 }} />
          ) : history.length === 0 ? (
            <Text style={styles.emptyHistory}>Ainda sem registos.</Text>
          ) : (
            history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                 <View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.historyPages}>
                      Pág {item.startPage || '?'} ➔ <Text style={{fontWeight:'bold'}}>{item.endPage}</Text>
                    </Text>
                 </View>
                 {item.notes ? (
                   <Text style={styles.historyNotes}>"{item.notes}"</Text>
                 ) : null}
              </View>
            ))
          )}
        </View>

      </ScrollView>

      {/* BOTÃO SALVAR (Fixo em baixo) */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <MaterialIcons name="save" size={24} color="#FFF" style={{marginRight: 8}} />
              <Text style={styles.saveButtonText}>Salvar Progresso</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5AB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#254E70',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  bookInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  bookDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#254E70',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  bookPages: {
    fontSize: 12,
    color: '#999999',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#254E70',
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#254E70',
    textAlign: 'center',
    marginBottom: 4,
  },
  progressPages: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  helperText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#254E70',
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#6B4FA0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  historyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loader: {
    marginVertical: 32,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyHistoryIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyHistoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 4,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  historyList: {
    marginTop: 8,
  },
  historyItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#254E70',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  historyPages: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default BookProgressScreen;