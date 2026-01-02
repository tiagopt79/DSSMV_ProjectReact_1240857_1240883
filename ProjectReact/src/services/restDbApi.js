// src/services/restDbApi.js
import { RESTDB_CONFIG, RESTDB_HEADERS } from '../consts/config';

const BASE_URL = RESTDB_CONFIG.DATABASE_URL;

// ========== BOOKS ==========

// Obter todos os livros
export const getAllBooks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/books`, {
      method: 'GET',
      headers: RESTDB_HEADERS,
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Obter livro por ID
export const getBookById = async (bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${bookId}`, {
      method: 'GET',
      headers: RESTDB_HEADERS,
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

// Adicionar novo livro
export const addBook = async (bookData) => {
  try {
    const response = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: RESTDB_HEADERS,
      body: JSON.stringify(bookData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

// Atualizar livro
export const updateBook = async (bookId, updates) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: RESTDB_HEADERS,
      body: JSON.stringify(updates),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// Remover livro
export const deleteBook = async (bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: RESTDB_HEADERS,
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

// Obter livros por status (reading, finished, wishlist)
export const getBooksByStatus = async (status) => {
  try {
    const query = JSON.stringify({ status });
    const response = await fetch(`${BASE_URL}/books?q=${query}`, {
      method: 'GET',
      headers: RESTDB_HEADERS,
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching books by status:', error);
    throw error;
  }
};

// Obter favoritos
export const getFavoriteBooks = async () => {
  try {
    const query = JSON.stringify({ isFavorite: true });
    const response = await fetch(`${BASE_URL}/books?q=${query}`, {
      method: 'GET',
      headers: RESTDB_HEADERS,
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching favorite books:', error);
    throw error;
  }
};

// ========== LISTS ==========

// Obter todas as listas
export const getAllLists = async () => {
  try {
    const response = await fetch(`${BASE_URL}/lists`, {
      method: 'GET',
      headers: RESTDB_HEADERS,
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }
};

// Criar nova lista
export const createList = async (listData) => {
  try {
    const response = await fetch(`${BASE_URL}/lists`, {
      method: 'POST',
      headers: RESTDB_HEADERS,
      body: JSON.stringify(listData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

// Atualizar lista
export const updateList = async (listId, updates) => {
  try {
    const response = await fetch(`${BASE_URL}/lists/${listId}`, {
      method: 'PUT',
      headers: RESTDB_HEADERS,
      body: JSON.stringify(updates),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating list:', error);
    throw error;
  }
};

// Remover lista
export const deleteList = async (listId) => {
  try {
    const response = await fetch(`${BASE_URL}/lists/${listId}`, {
      method: 'DELETE',
      headers: RESTDB_HEADERS,
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};

// ========== READING SESSIONS ==========

// Obter sessões de leitura de um livro
export const getReadingSessions = async (bookId) => {
  try {
    const query = JSON.stringify({ bookId });
    const response = await fetch(`${BASE_URL}/reading_sessions?q=${query}`, {
      method: 'GET',
      headers: RESTDB_HEADERS,
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching reading sessions:', error);
    throw error;
  }
};

// Adicionar sessão de leitura
export const addReadingSession = async (sessionData) => {
  try {
    const response = await fetch(`${BASE_URL}/reading_sessions`, {
      method: 'POST',
      headers: RESTDB_HEADERS,
      body: JSON.stringify(sessionData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding reading session:', error);
    throw error;
  }
};