import {
  FETCH_LISTS_SUCCESS,
  ADD_LIST_SUCCESS,
  DELETE_LIST_SUCCESS,
  UPDATE_LIST_SUCCESS
} from '../actions/listActions'; 
import { SET_LOADING } from '../types';

const initialState = {
  lists: [],
  loading: false,
  error: null,
};

const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case FETCH_LISTS_SUCCESS:
      return { ...state, lists: action.payload, loading: false };
    case ADD_LIST_SUCCESS:
      return { ...state, lists: [...state.lists, action.payload], loading: false };
    case UPDATE_LIST_SUCCESS:
      return {
        ...state,
        lists: state.lists.map(list => 
          list._id === action.payload._id ? action.payload : list
        ),
      };
    case DELETE_LIST_SUCCESS:
      return {
        ...state,
        lists: state.lists.filter(list => list._id !== action.payload),
      };
    default:
      return state;
  }
};

export default listsReducer;