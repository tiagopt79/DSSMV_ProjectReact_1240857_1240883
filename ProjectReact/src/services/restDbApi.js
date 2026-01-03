// src/services/restDbApi.js
// Configuração do RestDB.io
const RESTDB_URL = 'https://SEU_DATABASE-xxxx.restdb.io/rest';
const API_KEY = 'SUA_API_KEY_AQUI';

const headers = {
  'Content-Type': 'application/json',
  'x-apikey': API_KEY,
  'cache-control': 'no-cache',
};

// ========== BOOKS ==========

export const getAllBooks = async () => {
  try {
    const response = await fetch(`${RESTDB_URL}/books`, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (bookId) => {
  try {
    const response = await fetch(`${RESTDB_URL}/books/${bookId}`, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

export const addBook = async (bookData) => {
  try {
    const response = await fetch(`${RESTDB_URL}/books`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const updateBook = async (bookId, updates) => {
  try {
    const response = await fetch(`${RESTDB_URL}/books/${bookId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const response = await fetch(`${RESTDB_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

// ========== LISTS ==========

export const getAllLists = async () => {
  try {
    const response = await fetch(`${RESTDB_URL}/lists`, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }
};

export const createList = async (listData) => {
  try {
    const response = await fetch(`${RESTDB_URL}/lists`, {
      method: 'POST',
      headers,
      body: JSON.stringify(listData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

export const updateList = async (listId, updates) => {
  try {
    const response = await fetch(`${RESTDB_URL}/lists/${listId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating list:', error);
    throw error;
  }
};

export const deleteList = async (listId) => {
  try {
    const response = await fetch(`${RESTDB_URL}/lists/${listId}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};

// ========== READING SESSIONS ==========

export const addReadingSession = async (sessionData) => {
  try {
    const response = await fetch(`${RESTDB_URL}/reading-sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sessionData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding reading session:', error);
    throw error;
  }
};

export const getReadingSessions = async (bookId) => {
  try {
    const query = bookId ? `?q={"bookId":"${bookId}"}` : '';
    const response = await fetch(`${RESTDB_URL}/reading-sessions${query}`, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching reading sessions:', error);
    throw error;
  }
};