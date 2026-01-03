// src/flux/actions/bookActions.js
import * as types from '../types';
import * as OpenLibrary from '../../services/openLibraryApi';

/**
 * Action para buscar livros por título na Open Library
 * Esta é a action que o SearchScreen precisa
 */
export const searchBooks = (query) => async (dispatch) => {
  try {
    dispatch({ type: types.SET_LOADING, payload: true });
    
    const results = await OpenLibrary.searchByTitle(query);
    
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

/**
 * Busca livro por ISBN
 */
export const searchBookByISBN = (isbn) => async (dispatch) => {
  try {
    dispatch({ type: types.SET_LOADING, payload: true });
    
    const book = await OpenLibrary.searchByISBN(isbn);
    
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

/**
 * Busca livros por assunto/categoria
 */
export const searchBooksBySubject = (subject) => async (dispatch) => {
  try {
    dispatch({ type: types.SET_LOADING, payload: true });
    
    const results = await OpenLibrary.searchBySubject(subject);
    
    dispatch({ 
      type: types.SET_SEARCH_RESULTS, 
      payload: results 
    });
    
    return results;
  } catch (error) {
    console.error('Error searching by subject:', error);
    dispatch({ 
      type: types.SET_ERROR, 
      payload: error.message 
    });
    return [];
  }
};

/**
 * Limpa os resultados de busca
 */
export const clearSearchResults = () => (dispatch) => {
  dispatch({ 
    type: types.SET_SEARCH_RESULTS, 
    payload: [] 
  });
};