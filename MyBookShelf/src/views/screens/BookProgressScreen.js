import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Image,
  TextInput, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
// AQUI ESTÁ A CORREÇÃO: Importamos como MaterialIcons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { updateReadingProgress } from '../../flux/actions';
import colors from '../../theme/colors';

const BookProgressScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { book: initialBook } = route.params;

  const book = useSelector(state => 
    state.books.books.find(b => b._id === initialBook._id) || initialBook
  );

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Importar API só para ler histórico
  const { getReadingSessions } = require('../../services/restDbApi');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const sessions = await getReadingSessions(book._id);
      setHistory(sessions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const totalPages = book.pages || book.pageCount || 0;
  const current = book.current_page || book.currentPage || 0;

  const calculateProgress = () => {
    if (!totalPages) return 0;
    return Math.min(Math.round((current / totalPages) * 100), 100);
  };

  const handleSaveProgress = async () => {
    const newPage = parseInt(currentPage);

    if (!currentPage || isNaN(newPage)) {
      Alert.alert('Erro', 'Insira uma página válida');
      return;
    }
    if (newPage > totalPages) {
      Alert.alert('Erro', `O total de páginas é ${totalPages}`);
      return;
    }
    if (newPage < current) {
      Alert.alert('Aviso', 'Não podes retroceder na leitura!');
      return;
    }

    try {
      setSaving(true);
      await dispatch(updateReadingProgress(book._id, newPage, totalPages, notes));

      Alert.alert('Sucesso', 'Progresso guardado!');
      setCurrentPage('');
      setNotes('');
      loadHistory();
      
      if (newPage >= totalPages) {
        navigation.goBack();
      }

    } catch (error) {
      Alert.alert('Erro', 'Falha ao guardar progresso');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {/* USO CORRETO: MaterialIcons */}
          <MaterialIcons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Atualizar Leitura</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.bookInfoCard}>
          <Image source={{ uri: book.cover || book.thumbnail }} style={styles.bookCover} />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookPages}>{current} / {totalPages} páginas</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progresso Total</Text>
          <View style={styles.progressBarBg}>
             <View style={[styles.progressBarFill, { width: `${calculateProgress()}%` }]} />
          </View>
          <Text style={styles.percentText}>{calculateProgress()}% Lido</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Estou na página...</Text>
          <TextInput
            style={styles.input}
            placeholder={current.toString()}
            keyboardType="numeric"
            value={currentPage}
            onChangeText={setCurrentPage}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notas sobre a leitura (opcional)"
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveProgress}
            disabled={saving}
          >
             {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Guardar</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          {loadingHistory ? <ActivityIndicator color={colors.primary} /> : (
             history.map((h, i) => (
               <View key={i} style={styles.historyItem}>
                 <Text style={styles.historyDate}>{new Date(h.date).toLocaleDateString()}</Text>
                 <Text>Pág {h.startPage} ➔ {h.endPage}</Text>
                 {h.notes ? <Text style={styles.historyNote}>"{h.notes}"</Text> : null}
               </View>
             ))
          )}
        </View>
        <View style={{height: 50}} />
      </ScrollView>
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