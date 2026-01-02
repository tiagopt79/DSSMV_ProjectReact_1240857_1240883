// src/flux/reducers/readingProgressReducer.js
import * as types from '../types';

const initialState = {
  sessions: [],
  loading: false,
  error: null,
};

const readingProgressReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SESSIONS':
      return {
        ...state,
        sessions: action.payload,
        loading: false,
      };

    case types.ADD_READING_SESSION:
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
      };

    case types.UPDATE_PROGRESS:
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session._id === action.payload.sessionId
            ? { ...session, ...action.payload.updates }
            : session
        ),
      };

    default:
      return state;
  }
};

export default readingProgressReducer;

// Selectors
export const getSessionsByBook = (state, bookId) =>
  state.readingProgress.sessions.filter((s) => s.bookId === bookId);