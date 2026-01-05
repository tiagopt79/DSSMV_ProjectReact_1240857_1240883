import * as types from '../types';

const initialState = {
  lists: [],
  loading: false,
  error: null,
};

const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_LISTS:
      return {
        ...state,
        lists: action.payload,
        loading: false,
      };

    case types.CREATE_LIST:
      return {
        ...state,
        lists: [...state.lists, action.payload],
      };

    case types.UPDATE_LIST:
      return {
        ...state,
        lists: state.lists.map((list) =>
          list._id === action.payload.listId
            ? { ...list, ...action.payload.updates }
            : list
        ),
      };

    case types.DELETE_LIST:
      return {
        ...state,
        lists: state.lists.filter((list) => list._id !== action.payload),
      };

    case types.ADD_BOOK_TO_LIST:
      return {
        ...state,
        lists: state.lists.map((list) =>
          list._id === action.payload.listId
            ? { ...list, bookIds: [...list.bookIds, action.payload.bookId] }
            : list
        ),
      };

    case types.REMOVE_BOOK_FROM_LIST:
      return {
        ...state,
        lists: state.lists.map((list) =>
          list._id === action.payload.listId
            ? { 
                ...list, 
                bookIds: list.bookIds.filter(id => id !== action.payload.bookId) 
              }
            : list
        ),
      };

    default:
      return state;
  }
};

export default listsReducer;