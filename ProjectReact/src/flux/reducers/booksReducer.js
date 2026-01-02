// src/flux/reducers/booksReducer.js
import * as types from '../types';

const initialState = {
  books: [],
  loading: false,
  error: null,
  selectedBook: null,
};

const booksReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_BOOKS:
      return {
        ...state,
        books: action.payload,
        loading: false,
      };

    case types.ADD_BOOK:
      return {
        ...state,
        books: [...state.books, action.payload],
      };

    case types.UPDATE_BOOK:
      return {
        ...state,
        books: state.books.map((book) =>
          book._id === action.payload.bookId
            ? { ...book, ...action.payload.updates }
            : book
        ),
      };

    case types.REMOVE_BOOK:
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

    case types.TOGGLE_WISHLIST:
      return {
        ...state,
        books: state.books.map((book) =>
          book._id === action.payload
            ? {
                ...book,
                status: book.status === 'wishlist' ? 'reading' : 'wishlist',
              }
            : book
        ),
      };

    default:
      return state;
  }
};

export default booksReducer;

// Selectors
export const getAllBooks = (state) => state.books.books;
export const getBooksByStatus = (state, status) =>
  state.books.books.filter((book) => book.status === status);
export const getFavoriteBooks = (state) =>
  state.books.books.filter((book) => book.isFavorite);
export const getReadingBooks = (state) =>
  state.books.books.filter((book) => book.status === 'reading');