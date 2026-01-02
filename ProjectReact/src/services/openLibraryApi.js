// src/services/openLibraryApi.js
import { OPENLIBRARY_CONFIG } from '../consts/config';

// Pesquisar livros por ISBN
export const searchByISBN = async (isbn) => {
  try {
    const cleanISBN = isbn.replace(/[^0-9X]/gi, ''); // Remove hífens e espaços
    const response = await fetch(
      `${OPENLIBRARY_CONFIG.BASE_URL}/isbn/${cleanISBN}.json`
    );
    
    if (!response.ok) {
      throw new Error('Book not found');
    }
    
    const data = await response.json();
    return formatBookData(data, cleanISBN);
  } catch (error) {
    console.error('Error searching by ISBN:', error);
    throw error;
  }
};

// Pesquisar livros por título e/ou autor
export const searchBooks = async (query) => {
  try {
    const response = await fetch(
      `${OPENLIBRARY_CONFIG.SEARCH_URL}?q=${encodeURIComponent(query)}&limit=20`
    );
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    return data.docs.map(formatSearchResult);
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

// Pesquisar por título específico
export const searchByTitle = async (title) => {
  try {
    const response = await fetch(
      `${OPENLIBRARY_CONFIG.SEARCH_URL}?title=${encodeURIComponent(title)}&limit=20`
    );
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    return data.docs.map(formatSearchResult);
  } catch (error) {
    console.error('Error searching by title:', error);
    throw error;
  }
};

// Pesquisar por autor
export const searchByAuthor = async (author) => {
  try {
    const response = await fetch(
      `${OPENLIBRARY_CONFIG.SEARCH_URL}?author=${encodeURIComponent(author)}&limit=20`
    );
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    return data.docs.map(formatSearchResult);
  } catch (error) {
    console.error('Error searching by author:', error);
    throw error;
  }
};

// Obter detalhes completos de um livro
export const getBookDetails = async (workId) => {
  try {
    const response = await fetch(
      `${OPENLIBRARY_CONFIG.BASE_URL}/works/${workId}.json`
    );
    
    if (!response.ok) {
      throw new Error('Book details not found');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};

// Obter URL da capa do livro
export const getCoverUrl = (isbn, size = 'M') => {
  // Tamanhos: S (small), M (medium), L (large)
  if (!isbn) return null;
  return `${OPENLIBRARY_CONFIG.COVERS_URL}/isbn/${isbn}-${size}.jpg`;
};

// Obter capa por ID da Open Library
export const getCoverByOLID = (olid, size = 'M') => {
  if (!olid) return null;
  return `${OPENLIBRARY_CONFIG.COVERS_URL}/olid/${olid}-${size}.jpg`;
};

// ========== HELPER FUNCTIONS ==========

// Formatar dados do livro da API
const formatBookData = (data, isbn) => {
  return {
    isbn: isbn,
    title: data.title || 'Unknown Title',
    author: data.authors?.[0]?.name || data.by_statement || 'Unknown Author',
    cover: getCoverUrl(isbn),
    pages: data.number_of_pages || 0,
    publisher: data.publishers?.[0] || '',
    publishYear: data.publish_date ? extractYear(data.publish_date) : null,
    description: data.description?.value || data.description || '',
    subjects: data.subjects || [],
  };
};

// Formatar resultados da pesquisa
const formatSearchResult = (doc) => {
  const isbn = doc.isbn?.[0] || null;
  
  return {
    isbn: isbn,
    title: doc.title || 'Unknown Title',
    author: doc.author_name?.[0] || 'Unknown Author',
    cover: isbn ? getCoverUrl(isbn) : null,
    pages: doc.number_of_pages_median || 0,
    publishYear: doc.first_publish_year || null,
    publisher: doc.publisher?.[0] || '',
    workId: doc.key || null,
    editions: doc.edition_count || 1,
  };
};

// Extrair ano da data de publicação
const extractYear = (dateString) => {
  const match = dateString.match(/\d{4}/);
  return match ? parseInt(match[0]) : null;
};