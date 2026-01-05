import * as types from '../types';
import * as GoogleBooks from '../../services/googleBooksApi';


export const searchBooks = (query) => async (dispatch) => {
  try {
    dispatch({ type: types.SET_LOADING, payload: true });
    
    const results = await GoogleBooks.searchByTitle(query);
    
    dispatch({ 
      type: types.SET_SEARCH_RESULTS, 
      payload: results 
    });
    
    return results;
  } catch (error) {
    console.error('Error searching books:', error);
    dispatch({ 
      type: types.SET_ERROR, 
      payload: error.message 
    });
    return [];
  }
};


export const searchBookByISBN = (isbn) => async (dispatch) => {
  try {
    dispatch({ type: types.SET_LOADING, payload: true });
    
    const book = await GoogleBooks.searchByISBN(isbn);
    
    dispatch({ type: types.SET_LOADING, payload: false });
    
    return book;
  } catch (error) {
    console.error('Error searching by ISBN:', error);
    dispatch({ 
      type: types.SET_ERROR, 
      payload: error.message 
    });
    throw error;
  }
};


export const searchBooksByAuthor = (author) => async (dispatch) => {
  try {
    dispatch({ type: types.SET_LOADING, payload: true });
    
    const results = await GoogleBooks.searchByAuthor(author);
    
    dispatch({ 
      type: types.SET_SEARCH_RESULTS, 
      payload: results 
    });
    
    return results;
  } catch (error) {
    console.error('Error searching by author:', error);
    dispatch({ 
      type: types.SET_ERROR, 
      payload: error.message 
    });
    return [];
  }
};


export const getBookDetails = (bookId) => async (dispatch) => {
  try {
    dispatch({ type: types.SET_LOADING, payload: true });
    
    const book = await GoogleBooks.getBookDetails(bookId);
    
    dispatch({ type: types.SET_LOADING, payload: false });
    
    return book;
  } catch (error) {
    console.error('Error getting book details:', error);
    dispatch({ 
      type: types.SET_ERROR, 
      payload: error.message 
    });
    throw error;
  }
};


export const clearSearchResults = () => (dispatch) => {
  dispatch({ 
    type: types.SET_SEARCH_RESULTS, 
    payload: [] 
  });
};