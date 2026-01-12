import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import colors from '../../theme/colors';

const BookCard = ({ book, onPress, hideStatus = false }) => {
  
  const shouldShorwStatus = !hideStatus && book.status && book.status !== '';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.coverContainer}>
        {book.coverUrl || book.cover || book.thumbnail ? (
          <Image 
            source={{ uri: book.coverUrl || book.cover || book.thumbnail }} 
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noCover}>
            <Text style={styles.noCoverText}>📚</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title || 'Sem título'}
        </Text>
        
        <Text style={styles.author} numberOfLines={1}>
          {book.author || book.authors?.join(', ') || 'Autor desconhecido'}
        </Text>
        
        {}
        {(book.publishYear || book.publishedDate) && (
          <Text style={styles.year}>
            {book.publishYear || (book.publishedDate ? book.publishedDate.substring(0,4) : '')}
          </Text>
        )}
        
        {(book.pages > 0 || book.pageCount > 0) && (
          <Text style={styles.pages}>
            {book.pages || book.pageCount} páginas
          </Text>
        )}
        
        {}
        {shouldShowStatus && (
          <View style={[
            styles.statusBadge, 
            styles[`status_${book.status}`] || styles.status_default
          ]}>
            <Text style={[
              styles.statusText, 
              styles[`text_${book.status}`] || styles.text_default
            ]}>
              {getStatusLabel(book.status)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const getStatusLabel = (status) => {
  const labels = {
    wishlist: '💭 Quero ler',
    reading: '📖 Lendo',
    read: '✅ Lido',
    finished: '✅ Lido',
    abandoned: '⏸️ Abandonado',
    unread: '📚 Não lido',
  };
  return labels[status] || status;
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coverContainer: {
    width: 90,
    height: 130,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  noCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCoverText: {
    fontSize: 30,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  pages: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  status_wishlist: { backgroundColor: '#E3F2FD' }, 
  status_reading: { backgroundColor: '#FFF3E0' }, 
  status_read: { backgroundColor: '#E8F5E9' },   
  status_finished: { backgroundColor: '#E8F5E9' }, 
  status_abandoned: { backgroundColor: '#FFEBEE' },
  status_default: { backgroundColor: '#F5F5F5' },  
  
  statusText: { fontSize: 11, fontWeight: '600' },
  text_wishlist: { color: '#1976D2' },
  text_reading: { color: '#E65100' },
  text_read: { color: '#2E7D32' },
  text_finished: { color: '#2E7D32' },
  text_abandoned: { color: '#C62828' },
  text_default: { color: '#616161' },
});

export default BookCard;