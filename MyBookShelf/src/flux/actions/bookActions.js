import * as types from '../types';
import * as RestDB from '../../services/restDbApi';
import * as GoogleBooks from '../../services/googleBooksApi';

// --- PESQUISA (Google Books) ---

export const searchBooks = (query) => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const results = await GoogleBooks.searchByTitle(query);
    dispatch({ type: types.SET_SEARCH_RESULTS, payload: results });
  } catch (error) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
};

export const clearSearchResults = () => ({
  type: types.CLEAR_SEARCH_RESULTS
});

// --- CRUD (RestDB - A tua Biblioteca) ---

export const fetchBooks = () => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const books = await RestDB.getBooks();
    dispatch({ type: types.SET_BOOKS, payload: books });
  } catch (error) {
    console.error(error);
  } finally {
    dispatch({ type: types.SET_LOADING, payload: false });
  }
};

export const addBook = (bookData) => async (dispatch) => {
  try {
    const newBook = await RestDB.addBook(bookData);
    dispatch({ type: types.ADD_BOOK, payload: newBook });
    return newBook;
  } catch (error) {
    console.error('Erro ao adicionar livro:', error);
    throw error;
  }
};

export const addBookFromISBN = (isbn) => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const bookInfo = await GoogleBooks.searchByISBN(isbn);
    
    // Adiciona à biblioteca com status padrão 'toRead'
    const newBook = await RestDB.addBook({
      ...bookInfo,
      status: 'toRead',
      currentPage: 0,
      current_page: 0,
      progress: 0,
      isFavorite: false,
      dateAdded: new Date().toISOString(),
    });
    
    dispatch({ type: types.ADD_BOOK, payload: newBook });
    return newBook;
  } catch (error) {
    console.error('Erro ISBN:', error);
    throw error;
  } finally {
    dispatch({ type: types.SET_LOADING, payload: false });
  }
};

export const updateBook = (bookId, updates) => async (dispatch, getState) => {
  try {
    // Busca o livro atual do estado
    const currentBook = getState().books.books.find(b => b._id === bookId);
    
    // Se está a mudar para 'reading' e o livro estava 'read' ou tinha progresso, reseta
    if (updates.status === 'reading' && currentBook) {
      const wasRead = currentBook.status === 'read';
      const hadProgress = (currentBook.currentPage || currentBook.current_page || 0) > 0;
      
      if (wasRead || hadProgress) {
        // Reset do progresso quando volta a ler
        updates = {
          ...updates,
          currentPage: 0,
          current_page: 0,
          progress: 0,
          finished_date: null,
          last_read: new Date().toISOString(),
        };
      }
    }
    
    await RestDB.updateBook(bookId, updates);
    dispatch({
      type: types.UPDATE_BOOK,
      payload: { bookId, updates },
    });
  } catch (error) {
    console.error('Erro update:', error);
  }
};

export const deleteBook = (bookId) => async (dispatch) => {
  try {
    await RestDB.deleteBook(bookId);
    dispatch({ type: types.DELETE_BOOK, payload: bookId });
  } catch (error) {
    console.error('Erro delete:', error);
  }
};

export const toggleFavorite = (bookId, isFavorite) => async (dispatch) => {
  try {
    await RestDB.updateBook(bookId, { isFavorite });
    dispatch({ type: types.TOGGLE_FAVORITE, payload: bookId });
  } catch (error) {
    console.error('Erro favorito:', error);
  }
};

export const updateReadingProgress = (bookId, currentPage, totalPages, notes = '') => async (dispatch, getState) => {
  try {
    // Busca o livro atual para pegar a página anterior
    const currentBook = getState().books.books.find(b => b._id === bookId);
    const previousPage = currentBook?.currentPage || currentBook?.current_page || 0;
    
    const updates = {
      currentPage,
      current_page: currentPage,
      status: currentPage >= totalPages ? 'read' : 'reading',
      progress: totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0,
      last_read: new Date().toISOString()
    };
    
    if (currentPage >= totalPages) {
      updates.finished_date = new Date().toISOString();
    }
    
    await RestDB.updateBook(bookId, updates);
    dispatch({ type: types.UPDATE_BOOK, payload: { bookId, updates } });
    
    // Adiciona sessão de leitura com os campos obrigatórios
    if (currentPage > previousPage) {
      const session = {
        bookId,
        date: new Date().toISOString(),
        startPage: previousPage,
        endPage: currentPage,
        pagesRead: currentPage - previousPage,
        notes: notes || '',
      };
      
      await RestDB.addReadingSession(session);
    }
  } catch (error) {
    console.error('Erro progresso:', error);
    throw error;
  }
};