import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { updateBookProgress, getReadingSessions, addReadingSession, getBookById } from '../../services/restDbApi';

const BookProgressScreen = ({ navigation, route }) => {
  const { book: initialBook } = route.params;
  
  const [book, setBook] = useState(initialBook); // Estado do livro atualizado
  const [currentPage, setCurrentPage] = useState('');
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBookData();
    loadHistory();
  }, []);

  // Carregar dados atualizados do livro
  const loadBookData = async () => {
    try {
      const updatedBook = await getBookById(initialBook._id);
      setBook(updatedBook);
    } catch (error) {
      console.error('Erro ao carregar livro:', error);
    }
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const sessions = await getReadingSessions(initialBook._id);
      setHistory(sessions);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const totalPages = book.pageCount || book.pages || 0;
    const current = book.currentPage || book.current_page || 0;
    
    if (!totalPages || totalPages === 0) return 0;
    return Math.min(Math.round((current / totalPages) * 100), 100);
  };

  const handleSaveProgress = async () => {
    const newPage = parseInt(currentPage);
    const totalPages = book.pageCount || book.pages || 0;
    const lastPage = book.currentPage || book.current_page || 0;

    // Validações
    if (!currentPage || isNaN(newPage)) {
      Alert.alert('Erro', 'Por favor, insere uma página válida');
      return;
    }

    if (newPage < 0 || newPage > totalPages) {
      Alert.alert('Erro', `A página deve estar entre 0 e ${totalPages}`);
      return;
    }

    // VALIDAÇÃO: Não permite retroceder
    if (newPage < lastPage) {
      Alert.alert(
        'Aviso', 
        `Não podes retroceder! A última página registada foi ${lastPage}. Insere uma página igual ou superior.`
      );
      return;
    }

    if (newPage === lastPage) {
      Alert.alert('Aviso', 'Estás na mesma página');
      return;
    }

    try {
      setSaving(true);

      // Atualizar progresso do livro
      const updatedBook = await updateBookProgress(initialBook._id, newPage);
      setBook(updatedBook); // Atualiza o estado local

      // Adicionar sessão ao histórico
      const session = {
        bookId: initialBook._id,
        date: new Date().toISOString(),
        startPage: lastPage,
        endPage: newPage,
        pagesRead: newPage - lastPage,
        duration: 0,
        notes: notes || '',
      };

      await addReadingSession(session);

      Alert.alert('Sucesso', 'Progresso guardado!', [
        {
          text: 'OK',
          onPress: () => {
            setCurrentPage('');
            setNotes('');
            loadHistory();
          },
        },
      ]);
    } catch (error) {
      console.error('Erro ao guardar progresso:', error);
      Alert.alert('Erro', 'Não foi possível guardar o progresso');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  const renderHistoryItem = (session, index) => (
    <View key={index} style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Icon name="book" size={20} color="#254E70" />
        <Text style={styles.historyDate}>{formatDate(session.date)}</Text>
      </View>
      <Text style={styles.historyPages}>
        {session.startPage} → {session.endPage} páginas ({session.pagesRead} lidas)
      </Text>
      {session.notes && (
        <Text style={styles.historyNotes}>📝 {session.notes}</Text>
      )}
    </View>
  );

  const totalPages = book.pageCount || book.pages || 0;
  const currentPageNum = book.currentPage || book.current_page || 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#254E70" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Livro</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Informação do Livro */}
        <View style={styles.bookInfoCard}>
          <Image
            source={{ uri: book.thumbnail || book.cover || 'https://via.placeholder.com/128x196?text=Sem+Capa' }}
            style={styles.bookCover}
            resizeMode="cover"
          />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.authors?.join(', ') || book.author || 'Autor desconhecido'}</Text>
            <Text style={styles.bookPages}>{totalPages || '?'} páginas</Text>
          </View>
        </View>

        {/* Progresso de Leitura */}
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Progresso de Leitura</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${calculateProgress()}%` }]} />
            </View>
          </View>
          <Text style={styles.progressPercentage}>{calculateProgress()}%</Text>
          <Text style={styles.progressPages}>
            {currentPageNum} de {totalPages || '?'} páginas lidas
          </Text>
        </View>

        {/* Atualizar Progresso */}
        <View style={styles.updateCard}>
          <Text style={styles.sectionTitle}>Atualizar Progresso</Text>
          
          <Text style={styles.helperText}>
            Última página: {currentPageNum} | Total: {totalPages}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={`Página atual (mínimo: ${currentPageNum})`}
            placeholderTextColor="#999999"
            keyboardType="numeric"
            value={currentPage}
            onChangeText={setCurrentPage}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notas (opcional)"
            placeholderTextColor="#999999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSaveProgress}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Progresso</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Histórico de Leitura */}
        <View style={styles.historyCard}>
          <View style={styles.historyTitleContainer}>
            <Icon name="history" size={24} color="#254E70" />
            <Text style={styles.sectionTitle}>Histórico de Leitura</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#254E70" style={styles.loader} />
          ) : history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryIcon}>📖</Text>
              <Text style={styles.emptyHistoryText}>Nenhum histórico ainda</Text>
              <Text style={styles.emptyHistorySubtext}>
                Guarda o teu progresso para começar
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history.map((session, index) => renderHistoryItem(session, index))}
            </View>
          )}
        </View>
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