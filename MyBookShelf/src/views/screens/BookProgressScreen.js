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
import { getReadingSessions } from '../../services/restDbApi';

const BookProgressScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { book: initialBook } = route.params;

  // Ligar ao Redux para ter sempre os dados mais frescos do livro
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
      Alert.alert('Erro', 'Insere um número de página válido.');
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
      await dispatch(updateReadingProgress(book._id, pageNum, totalPages, notes));

      Alert.alert('Sucesso', 'Progresso registado!', [
        { 
          text: 'OK', 
          onPress: () => {
            setNotes('');
            loadHistory();
            
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
      <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color="#2A5288" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registar Progresso</Text>
        <View style={{ width: 48 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* INFO DO LIVRO */}
        <View style={styles.bookInfoCard}>
          <Image 
            source={{ uri: book.cover || book.thumbnail || 'https://via.placeholder.com/100' }} 
            style={styles.cover} 
          />
          <View style={styles.bookTextInfo}>
            <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
            <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
            <View style={styles.pagesBadge}>
              <MaterialIcons name="menu-book" size={14} color="#666" />
              <Text style={styles.pagesText}>{totalPages || '?'} páginas</Text>
            </View>
          </View>
        </View>

        {/* PROGRESSO ATUAL */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <MaterialIcons name="trending-up" size={24} color="#2A5288" />
            <Text style={styles.cardTitle}>Progresso Atual</Text>
          </View>
          
          <View style={styles.progressVisual}>
            <Text style={styles.bigPercentage}>{Math.round((current / totalPages) * 100)}%</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.round((current / totalPages) * 100)}%` }]} />
            </View>
            <Text style={styles.currentPageText}>Página {current} de {totalPages}</Text>
          </View>
        </View>

        {/* REGISTAR NOVA PÁGINA */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <MaterialIcons name="add-circle-outline" size={24} color="#7B1FA2" />
            <Text style={styles.cardTitle}>Atualizar Progresso</Text>
          </View>
          
          <Text style={styles.helperText}>Em que página estás agora?</Text>
          
          <View style={styles.pageInputContainer}>
            <TextInput
              style={styles.pageInput}
              value={currentPage}
              onChangeText={setCurrentPage}
              keyboardType="number-pad"
              placeholder={current.toString()}
              placeholderTextColor="#999"
              maxLength={5}
            />
            <Text style={styles.totalText}>/ {totalPages || '?'}</Text>
          </View>

          {/* PREVIEW DO NOVO PROGRESSO */}
          {currentPage && parseInt(currentPage) > current && (
            <View style={styles.previewProgress}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: '#7B1FA2' }]} />
              </View>
              <Text style={styles.previewText}>
                {percentage}% completado • +{parseInt(currentPage) - current} páginas lidas
              </Text>
            </View>
          )}
        </View>

        {/* NOTAS */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <MaterialIcons name="edit-note" size={24} color="#FF9800" />
            <Text style={styles.cardTitle}>Notas da Sessão (opcional)</Text>
          </View>
          
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="O que achaste desta parte? Escreve aqui as tuas impressões..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* HISTÓRICO */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <MaterialIcons name="history" size={24} color="#4CAF50" />
            <Text style={styles.cardTitle}>Histórico de Leitura</Text>
          </View>
          
          {loadingHistory ? (
            <ActivityIndicator color="#2A5288" style={{ marginTop: 20, marginBottom: 20 }} />
          ) : history.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="history" size={48} color="#DDD" />
              <Text style={styles.emptyText}>Ainda sem registos</Text>
              <Text style={styles.emptySubtext}>Começa a registar o teu progresso!</Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history.slice(0, 5).reverse().map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyTop}>
                    <View style={styles.historyDateBadge}>
                      <MaterialIcons name="calendar-today" size={12} color="#666" />
                      <Text style={styles.historyDate}>
                        {new Date(item.date).toLocaleDateString('pt-PT', { 
                          day: '2-digit', 
                          month: 'short' 
                        })}
                      </Text>
                    </View>
                    <Text style={styles.historyPages}>
                      Pág. {item.startPage || current} → <Text style={{fontWeight:'bold', color: '#4CAF50'}}>{item.endPage}</Text>
                    </Text>
                  </View>
                  {item.notes ? (
                    <Text style={styles.historyNotes}>"{item.notes}"</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTÃO SALVAR FIXO */}
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
              <MaterialIcons name="check-circle" size={24} color="#FFF" />
              <Text style={styles.saveButtonText}>Guardar Progresso</Text>
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
    backgroundColor: '#E8D5A8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 50,
    paddingBottom: 15,
    backgroundColor: '#E8D5A8',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A5288',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // CARD DO LIVRO
  bookInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  bookTextInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A5288',
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  pagesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  pagesText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  
  // CARDS GERAIS
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A5288',
  },
  
  // PROGRESSO VISUAL
  progressVisual: {
    alignItems: 'center',
  },
  bigPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2A5288',
    marginBottom: 12,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  currentPageText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  
  // INPUT DE PÁGINA
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  pageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  pageInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A5288',
    textAlign: 'center',
  },
  totalText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // PREVIEW DO PROGRESSO
  previewProgress: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
  },
  previewText: {
    fontSize: 13,
    color: '#7B1FA2',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  
  // NOTAS
  notesInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  
  // HISTÓRICO
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#BBB',
    marginTop: 4,
  },
  historyList: {
    marginTop: 8,
  },
  historyItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  historyPages: {
    fontSize: 13,
    color: '#666',
  },
  historyNotes: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 18,
  },
  
  // FOOTER
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E8D5A8',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  saveButton: {
    backgroundColor: '#2A5288',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  saveButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookProgressScreen;