import * as types from '../types';
import * as RestDB from '../../services/restDbApi';
import * as GoogleBooks from '../../services/googleBooksApi';

export const fetchBooks = () => async (dispatch) => {
  try {
    const books = await RestDB.getBooks();
    dispatch({ type: types.SET_BOOKS, payload: books });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

export const addBookFromISBN = (isbn) => async (dispatch) => {
  try {
    const bookInfo = await GoogleBooks.searchByISBN(isbn);
    
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


export const fetchLists = () => async (dispatch) => {
  try {
    const lists = await RestDB.getLists();
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


export const searchBooksByTitle = async (title) => {
  try {
    return await GoogleBooks.searchByTitle(title);
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const searchBooksByAuthor = async (author) => {
  try {
    return await GoogleBooks.searchByAuthor(author);
  } catch (error) {
    console.error('Error searching by author:', error);
    return [];
  }
};

export const searchBookByISBN = async (isbn) => {
  try {
    return await GoogleBooks.searchByISBN(isbn);
  } catch (error) {
    console.error('Error searching by ISBN:', error);
    throw error;
  }
};

export const getBookDetails = async (bookId) => {
  try {
    return await GoogleBooks.getBookDetails(bookId);
  } catch (error) {
    console.error('Error getting book details:', error);
    throw error;
  }
};