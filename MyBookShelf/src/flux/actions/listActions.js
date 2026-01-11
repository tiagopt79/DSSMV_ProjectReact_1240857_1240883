import * as types from '../types';
import * as RestDB from '../../services/restDbApi';

export const fetchLists = () => async (dispatch) => {
  try {
    const lists = await RestDB.getLists();
    dispatch({ type: types.SET_LISTS, payload: lists });
  } catch (error) {
    console.error('Erro listas:', error);
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
  } catch (error) {
    console.error('Erro criar lista:', error);
  }
};

export const deleteList = (listId) => async (dispatch) => {
  try {
    await RestDB.deleteList(listId);
    dispatch({ type: types.DELETE_LIST, payload: listId });
  } catch (error) {
    console.error('Erro apagar lista:', error);
  }
};

export const addBookToList = (listId, bookId) => async (dispatch, getState) => {
  try {
    const list = getState().lists.lists.find((l) => l._id === listId);
    // Evita duplicados na lista
    if (list.bookIds.includes(bookId)) return;

    const updatedBookIds = [...list.bookIds, bookId];
    
    await RestDB.updateList(listId, { bookIds: updatedBookIds });
    dispatch({
      type: types.ADD_BOOK_TO_LIST,
      payload: { listId, bookId },
    });
  } catch (error) {
    console.error('Erro adicionar à lista:', error);
  }
};

export const removeBookFromList = (listId, bookId) => async (dispatch) => {
  try {
    // A lógica de remover da API já deve estar no RestDB.js ou fazemos update manual
    // Aqui assumimos que o updateList resolve
    const updatedList = await RestDB.removeBookFromList(listId, bookId); 
    // Se o RestDB.js não tiver removeBookFromList, usamos updateList com filtro
    
    dispatch({
      type: types.REMOVE_BOOK_FROM_LIST,
      payload: { listId, bookId },
    });
  } catch (error) {
    console.error('Erro remover da lista:', error);
  }
};