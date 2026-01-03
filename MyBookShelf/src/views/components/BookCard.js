// src/views/components/BookCard.js
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import colors from '../../theme/colors';

const BookCard = ({ book, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.coverContainer}>
        {book.coverUrl || book.cover ? (
          <Image 
            source={{ uri: book.coverUrl || book.cover }} 
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
          {book.author || 'Autor desconhecido'}
        </Text>
        
        {book.publishYear && book.publishYear !== '' && (
          <Text style={styles.year}>{book.publishYear}</Text>
        )}
        
        {book.pages > 0 && (
          <Text style={styles.pages}>{book.pages} páginas</Text>
        )}
        
        {book.status && (
          <View style={[styles.statusBadge, styles[`status_${book.status}`]]}>
            <Text style={styles.statusText}>
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
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCoverText: {
    fontSize: 40,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  pages: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  status_wishlist: {
    backgroundColor: '#E6F3FF',
  },
  status_reading: {
    backgroundColor: '#FFF4E6',
  },
  status_read: {
    backgroundColor: '#E6F9F0',
  },
  status_finished: {
    backgroundColor: '#E6F9F0',
  },
  status_abandoned: {
    backgroundColor: '#F5F5F5',
  },
  status_unread: {
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default BookCard;