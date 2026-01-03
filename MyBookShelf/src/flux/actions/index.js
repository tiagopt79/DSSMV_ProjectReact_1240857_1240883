// src/flux/actions/index.js
import * as types from '../types';
import * as RestDB from '../../services/restDbApi';
import * as OpenLibrary from '../../services/openLibraryApi';

// ========== BOOKS ACTIONS ==========

export const fetchBooks = () => async (dispatch) => {
  try {
    const books = await RestDB.getAllBooks();
    dispatch({ type: types.SET_BOOKS, payload: books });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

export const addBookFromISBN = (isbn) => async (dispatch) => {
  try {
    // 1. Buscar info do livro na Open Library
    const bookInfo = await OpenLibrary.searchByISBN(isbn);
    
    // 2. Adicionar ao RestDB
    const newBook = await RestDB.addBook({
      ...bookInfo,
      status: 'wishlist',
      currentPage: 0,
      isFavorite: false,
      dateAdded: new Date().toISOString(),
    });
    
    dispatch({ type: types.ADD_BOOK, payload: newBook });
    return newBook;
  } catch (error) {
    console.error('Error adding book from ISBN:', error);
    throw error;
  }
};

export const addBook = (bookData) => async (dispatch) => {
  try {
    const newBook = await RestDB.addBook(bookData);
    dispatch({ type: types.ADD_BOOK, payload: newBook });
    return newBook;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const updateBook = (bookId, updates) => async (dispatch) => {
  try {
    await RestDB.updateBook(bookId, updates);
    dispatch({
      type: types.UPDATE_BOOK,
      payload: { bookId, updates },
    });
  } catch (error) {
    console.error('Error updating book:', error);
  }
};

export const deleteBook = (bookId) => async (dispatch) => {
  try {
    await RestDB.deleteBook(bookId);
    dispatch({ type: types.REMOVE_BOOK, payload: bookId });
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};

export const toggleFavorite = (bookId, currentStatus) => async (dispatch) => {
  try {
    await RestDB.updateBook(bookId, { isFavorite: !currentStatus });
    dispatch({ type: types.TOGGLE_FAVORITE, payload: bookId });
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

export const updateReadingProgress = (bookId, currentPage, totalPages, notes = '') => async (dispatch) => {
  try {
    const updates = {
      currentPage,
      status: currentPage >= totalPages ? 'finished' : 'reading',
      dateFinished: currentPage >= totalPages ? new Date().toISOString() : null,
    };
    
    await RestDB.updateBook(bookId, updates);
    dispatch({ type: types.UPDATE_BOOK, payload: { bookId, updates } });
    
    // Adicionar sessão de leitura
    const session = {
      bookId,
      date: new Date().toISOString(),
      endPage: currentPage,
      notes,
    };
    
    await RestDB.addReadingSession(session);
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

// ========== LISTS ACTIONS ==========

export const fetchLists = () => async (dispatch) => {
  try {
    const lists = await RestDB.getAllLists();
    dispatch({ type: 'SET_LISTS', payload: lists });
  } catch (error) {
    console.error('Error fetching lists:', error);
  }
};

export const createList = (listData) => async (dispatch) => {
  try {
    const newList = await RestDB.createList({
      ...listData,
      bookIds: [],
      createdAt: new Date().toISOString(),
    });
    dispatch({ type: types.CREATE_LIST, payload: newList });
    return newList;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

export const deleteList = (listId) => async (dispatch) => {
  try {
    await RestDB.deleteList(listId);
    dispatch({ type: types.DELETE_LIST, payload: listId });
  } catch (error) {
    console.error('Error deleting list:', error);
  }
};

export const addBookToList = (listId, bookId) => async (dispatch, getState) => {
  try {
    const list = getState().lists.lists.find((l) => l._id === listId);
    const updatedBookIds = [...list.bookIds, bookId];
    
    await RestDB.updateList(listId, { bookIds: updatedBookIds });
    dispatch({
      type: types.ADD_BOOK_TO_LIST,
      payload: { listId, bookId },
    });
  } catch (error) {
    console.error('Error adding book to list:', error);
  }
};

// ========== SEARCH ACTIONS ==========

export const searchBooksByTitle = async (title) => {
  try {
    return await OpenLibrary.searchByTitle(title);
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const searchBookByISBN = async (isbn) => {
  try {
    return await OpenLibrary.searchByISBN(isbn);
  } catch (error) {
    console.error('Error searching by ISBN:', error);
    throw error;
  }
};