// src/services/openLibraryApi.js
const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b';

/**
 * Busca livros por título
 */
export const searchByTitle = async (title) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search.json?title=${encodeURIComponent(title)}&limit=20`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Formata os dados para o formato que a app espera
    return data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name?.[0] || 'Autor Desconhecido',
      coverUrl: book.cover_i 
        ? `${COVERS_URL}/id/${book.cover_i}-M.jpg`
        : null,
      isbn: book.isbn?.[0] || null,
      publishYear: book.first_publish_year || null,
      pages: book.number_of_pages_median || null,
      description: book.first_sentence?.[0] || '',
      subjects: book.subject?.slice(0, 5) || [],
      openLibraryId: book.key,
    }));
  } catch (error) {
    console.error('Error searching by title:', error);
    throw error;
  }
};

/**
 * Busca livro por ISBN
 */
export const searchByISBN = async (isbn) => {
  try {
    // Remove hífens e espaços do ISBN
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    
    const response = await fetch(
      `${BASE_URL}/isbn/${cleanISBN}.json`
    );
    
    if (!response.ok) {
      throw new Error('Livro não encontrado');
    }
    
    const data = await response.json();
    
    // Busca informações adicionais do work
    let workData = null;
    if (data.works?.[0]?.key) {
      try {
        const workResponse = await fetch(`${BASE_URL}${data.works[0].key}.json`);
        workData = await workResponse.json();
      } catch (e) {
        console.log('Could not fetch work data');
      }
    }
    
    // Busca informações do autor
    let authorName = 'Autor Desconhecido';
    if (data.authors?.[0]?.key) {
      try {
        const authorResponse = await fetch(`${BASE_URL}${data.authors[0].key}.json`);
        const authorData = await authorResponse.json();
        authorName = authorData.name;
      } catch (e) {
        console.log('Could not fetch author data');
      }
    }
    
    return {
      id: data.key,
      title: data.title,
      author: authorName,
      coverUrl: data.covers?.[0] 
        ? `${COVERS_URL}/id/${data.covers[0]}-M.jpg`
        : null,
      isbn: cleanISBN,
      publishYear: data.publish_date ? new Date(data.publish_date).getFullYear() : null,
      pages: data.number_of_pages || null,
      description: workData?.description?.value || workData?.description || '',
      subjects: workData?.subjects?.slice(0, 5) || [],
      publisher: data.publishers?.[0] || null,
      openLibraryId: data.key,
    };
  } catch (error) {
    console.error('Error searching by ISBN:', error);
    throw error;
  }
};

/**
 * Busca detalhes completos de um livro pelo ID do Open Library
 */
export const getBookDetails = async (bookId) => {
  try {
    // bookId vem no formato "/works/OL45804W"
    const response = await fetch(`${BASE_URL}${bookId}.json`);
    
    if (!response.ok) {
      throw new Error('Livro não encontrado');
    }
    
    const data = await response.json();
    
    // Busca informações do autor
    let authorName = 'Autor Desconhecido';
    if (data.authors?.[0]?.author?.key) {
      try {
        const authorResponse = await fetch(`${BASE_URL}${data.authors[0].author.key}.json`);
        const authorData = await authorResponse.json();
        authorName = authorData.name;
      } catch (e) {
        console.log('Could not fetch author data');
      }
    }
    
    return {
      id: data.key,
      title: data.title,
      author: authorName,
      coverUrl: data.covers?.[0] 
        ? `${COVERS_URL}/id/${data.covers[0]}-L.jpg`
        : null,
      description: data.description?.value || data.description || '',
      subjects: data.subjects?.slice(0, 10) || [],
      firstPublishDate: data.first_publish_date || null,
      openLibraryId: data.key,
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};

/**
 * Busca livros por assunto/categoria
 */
export const searchBySubject = async (subject, limit = 20) => {
  try {
    const response = await fetch(
      `${BASE_URL}/subjects/${encodeURIComponent(subject.toLowerCase())}.json?limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.works.map(book => ({
      id: book.key,
      title: book.title,
      author: book.authors?.[0]?.name || 'Autor Desconhecido',
      coverUrl: book.cover_id 
        ? `${COVERS_URL}/id/${book.cover_id}-M.jpg`
        : null,
      openLibraryId: book.key,
      firstPublishYear: book.first_publish_year || null,
    }));
  } catch (error) {
    console.error('Error searching by subject:', error);
    throw error;
  }
};

/**
 * Helper para obter URL da capa em diferentes tamanhos
 * @param {string} coverId - ID da capa
 * @param {string} size - Tamanho: 'S', 'M', 'L'
 */
export const getCoverUrl = (coverId, size = 'M') => {
  if (!coverId) return null;
  return `${COVERS_URL}/id/${coverId}-${size}.jpg`;
};