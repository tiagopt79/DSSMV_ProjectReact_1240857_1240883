import * as types from '../types';

const initialState = {
  books: [],           
  searchResults: [],   
  loading: false,
  error: null,
};

const booksReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_LOADING:
      return { ...state, loading: action.payload };

    case types.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    
    case types.SET_BOOKS:
      return { ...state, books: action.payload, loading: false };

    case types.ADD_BOOK:
      return { ...state, books: [...state.books, action.payload], loading: false };

    case types.UPDATE_BOOK:
      return {
        ...state,
        books: state.books.map((book) =>
          book._id === action.payload.bookId
            ? { ...book, ...action.payload.updates }
            : book
        ),
      };

    case types.DELETE_BOOK:
      return {
        ...state,
        books: state.books.filter((book) => book._id !== action.payload),
      };

    case types.TOGGLE_FAVORITE:
      return {
        ...state,
        books: state.books.map((book) =>
          book._id === action.payload
            ? { ...book, isFavorite: !book.isFavorite }
            : book
        ),
      };

   
    case types.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload, loading: false };

    case types.CLEAR_SEARCH_RESULTS:
      return { ...state, searchResults: [] };

    default:
      return state;
  }
};

export default booksReducer;