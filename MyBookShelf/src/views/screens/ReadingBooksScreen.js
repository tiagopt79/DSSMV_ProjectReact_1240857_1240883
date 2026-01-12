import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { updateBook, fetchBooks } from '../../flux/actions';
import colors from '../../theme/colors';

const ReadingBooksScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { books } = useSelector(state => state.books);
  
  const readingBooks = books.filter(book => book.status === 'reading');

  useEffect(() => {
    if (books.length === 0) dispatch(fetchBooks());
  }, [dispatch, books.length]);

  const handleUpdateProgress = (book) => {
    navigation.navigate('BookProgress', { book });
  };

  const handleFinishBook = (book) => {
    Alert.alert(
      'Terminar Livro',
      `Marcar "${book.title}" como lido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: () => {
            dispatch(updateBook(book._id, {
              status: 'read',
              current_page: book.pages || book.pageCount,
              progress: 100,
              finished_date: new Date().toISOString(),
            }));
            Alert.alert('Parabéns!', 'Livro terminado.');
          },
        },
      ]
    );
  };

  const getProgressColor = (p) => p < 30 ? colors.error : p < 70 ? colors.warning : colors.success;

  const renderBookCard = ({ item }) => {
    const currentPage = item.current_page || item.currentPage || 0;
    const totalPages = item.pages || item.pageCount || 0;
    const progress = (totalPages > 0 && currentPage > 0) ? Math.round((currentPage / totalPages) * 100) : 0;
    
    return (
      <View style={styles.bookCard}>
        {}
        <TouchableOpacity
          style={styles.cardContent} 
          onPress={() => navigation.navigate('LibraryBookDetails', { book: item })}
          activeOpacity={0.7}
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
            <View>
              <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{item.author || 'Autor Desconhecido'}</Text>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: getProgressColor(progress) }]} />
              </View>
              <Text style={styles.progressText}>{progress}% ({currentPage}/{totalPages})</Text>
            </View>
          </View>
        </TouchableOpacity>

        {}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleUpdateProgress(item)}>
            <MaterialIcons name="edit" size={18} color={colors.primary} />
            <Text style={styles.actionBtnText}>Atualizar</Text>
          </TouchableOpacity>

          <View style={styles.verticalDivider} />

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleFinishBook(item)}>
            <MaterialIcons name="check-circle" size={18} color={colors.success} />
            <Text style={[styles.actionBtnText, { color: colors.success }]}>Terminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8D5A8" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>A Ler</Text>
        <View style={styles.statsRow}>
          <MaterialIcons name="menu-book" size={38} color={colors.primary} />
          <View style={styles.statsInfo}>
            <Text style={styles.statsNumber}>{readingBooks.length}</Text>
            <Text style={styles.statsLabel}>livros em progresso</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={readingBooks}
        renderItem={renderBookCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="menu-book" size={90} color="#ccc" />
            <Text style={styles.emptyTitle}>Nada a ler</Text>
            <Text style={styles.emptyText}>Escolhe um livro da biblioteca!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#E8D5A8' 
  },
  header: { 
    paddingTop: 15, 
    paddingBottom: 15, 
    paddingHorizontal: 20 
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
    marginBottom: 16 
  },
  statsRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  statsInfo: { 
    marginLeft: 16, 
    flex: 1 
  },
  statsNumber: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#000000', 
    marginBottom: 2 
  },
  statsLabel: { 
    fontSize: 14, 
    color: '#4A4A4A' 
  },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 30 
  },
  
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  
  },
  

  cardContent: {
    flexDirection: 'row', 
    padding: 16,
  },
  coverContainer: { 
    marginRight: 16 
  },
  cover: { 
    width: 85, 
    height: 125, 
    borderRadius: 10, 
    backgroundColor: '#E0E0E0' 
  },
  noCover: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F0F0F0' 
  },
  bookInfo: { 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  bookTitle: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#2A5288', 
    marginBottom: 4, 
    lineHeight: 22 
  },
  bookAuthor: { 
    fontSize: 14, 
    color: '#666666', 
    marginBottom: 8 
  },
  progressSection: { 
    marginTop: 'auto' 
  },
  progressBarBg: { 
    height: 8, 
    backgroundColor: '#E0E0E0', 
    borderRadius: 4, 
    overflow: 'hidden', 
    marginBottom: 6 
  },
  progressBarFill: { 
    height: '100%', 
    borderRadius: 4 
  },
  progressText: { 
    fontSize: 12, 
    color: '#666', 
    fontWeight: '600' 
  },

  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: 48,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FAFAFA',
  },
  actionBtnText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#2A5288' 
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },

  emptyContainer: { 
    alignItems: 'center', 
    paddingVertical: 80, 
    paddingHorizontal: 30 
  },
  emptyTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#000000', 
    marginTop: 20, 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  emptyText: { 
    fontSize: 15, 
    color: '#666666', 
    textAlign: 'center', 
    marginBottom: 30, 
    lineHeight: 22 
  },
});

export default ReadingBooksScreen;