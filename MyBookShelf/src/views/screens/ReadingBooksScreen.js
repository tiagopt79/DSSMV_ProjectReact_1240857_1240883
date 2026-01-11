import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { updateBook } from '../../flux/actions'; // Action do Redux
import colors from '../../theme/colors';

const ReadingBooksScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // 1. Filtra livros com status 'reading' diretamente do Redux
  const books = useSelector(state => 
    state.books.books.filter(book => book.status === 'reading')
  );

  const handleUpdateProgress = (book) => {
    // Passamos o livro para o ecrã de progresso
    navigation.navigate('BookProgress', { book });
  };

  const handleFinishBook = (book) => {
    Alert.alert(
      '✓ Terminar Livro',
      `Marcar "${book.title}" como lido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: () => {
            // 2. Dispara a action para atualizar no Redux (e API)
            // O Redux remove-o automaticamente desta lista porque o status muda
            dispatch(updateBook(book._id, {
              status: 'read',
              current_page: book.pages || book.pageCount,
              progress: 100,
              finished_date: new Date().toISOString(),
            }));
            Alert.alert('🎉 Parabéns!', `Terminou "${book.title}"!`);
          },
        },
      ]
    );
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return colors.error; // Vermelho
    if (progress < 70) return colors.warning; // Laranja
    return colors.success; // Verde
  };

  const renderBookCard = ({ item }) => {
    const currentPage = item.current_page || item.currentPage || 0;
    const totalPages = item.pages || item.pageCount || 0;
    
    const progress = (totalPages > 0 && currentPage > 0) 
      ? Math.round((currentPage / totalPages) * 100) 
      : 0;
    
    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => handleUpdateProgress(item)}
        activeOpacity={0.95}
      >
        <View style={styles.coverContainer}>
          {item.cover ? (
            <Image source={{ uri: item.cover }} style={styles.cover} />
          ) : (
            <View style={[styles.cover, styles.noCover]}>
              <MaterialIcons name="menu-book" size={45} color={colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>{item.author || 'Autor Desconhecido'}</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progress}%`, backgroundColor: getProgressColor(progress) }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progress}% ({currentPage}/{totalPages})
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.updateBtn} onPress={() => handleUpdateProgress(item)}>
              <MaterialIcons name="edit" size={18} color={colors.primary} />
              <Text style={styles.updateBtnText}>Atualizar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.finishBtn} onPress={() => handleFinishBook(item)}>
              <MaterialIcons name="check-circle" size={18} color={colors.success} />
              <Text style={styles.finishBtnText}>Terminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Livros em Leitura</Text>
        <View style={styles.statsRow}>
          <MaterialIcons name="menu-book" size={38} color={colors.primary} />
          <View style={styles.statsInfo}>
            <Text style={styles.statsNumber}>{books.length}</Text>
            <Text style={styles.statsLabel}>Livros a ler de momento</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="menu-book" size={90} color={colors.iconGray} />
            <Text style={styles.emptyTitle}>Nenhum Livro em Leitura</Text>
            <Text style={styles.emptyText}>Adicione livros à sua biblioteca e comece a ler!</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('MyLibrary')}>
              <Text style={styles.emptyBtnText}>Ir para Biblioteca</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
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
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 22,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A5288',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  coverContainer: {
    marginRight: 16,
  },
  cover: {
    width: 95,
    height: 140,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  noCover: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A5288',
    marginBottom: 5,
    lineHeight: 23,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 13,
    color: '#4A4A4A',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  updateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  updateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A5288',
  },
  finishBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  finishBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#27AE60',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A5288',
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 4,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ReadingBooksScreen;