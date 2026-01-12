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
    console.log('📋 Adicionando livro à lista:', { listId, bookId });
    console.log('📊 Estado atual das listas:', getState().lists);
    
    let list = getState().lists.lists.find((l) => l._id === listId);
    
    // Se a lista não existe, busca novamente do servidor
    if (!list) {
      console.warn('⚠️ Lista não encontrada no estado, buscando do servidor...');
      await dispatch(fetchLists());
      
      // Pequeno delay para garantir que o estado foi atualizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Tenta novamente depois de buscar
      list = getState().lists.lists.find((l) => l._id === listId);
      
      console.log('🔄 Listas após fetch:', getState().lists.lists);
      console.log('🔍 Procurando lista com ID:', listId);
      
      if (!list) {
        // Tenta buscar diretamente da API
        console.warn('⚠️ Tentando buscar lista diretamente da API...');
        const allLists = await RestDB.getLists();
        console.log('📥 Listas da API:', allLists);
        
        list = allLists.find((l) => l._id === listId);
        
        if (!list) {
          throw new Error(`Lista com ID ${listId} não encontrada no servidor`);
        }
        
        // Atualiza o estado Redux com as listas corretas
        dispatch({ type: types.SET_LISTS, payload: allLists });
      }
    }
    
    // Evita duplicados na lista
    if (list.bookIds && list.bookIds.includes(bookId)) {
      console.log('ℹ️ Livro já está na lista');
      return;
    }

    const updatedBookIds = [...(list.bookIds || []), bookId];
    
    console.log('💾 Atualizando lista com bookIds:', updatedBookIds);
    await RestDB.updateList(listId, { bookIds: updatedBookIds });
    
    dispatch({
      type: types.ADD_BOOK_TO_LIST,
      payload: { listId, bookId },
    });
    
    console.log('✅ Livro adicionado à lista com sucesso');
  } catch (error) {
    console.error('❌ Erro adicionar à lista:', error);
    throw error;
  }
};

export const removeBookFromList = (listId, bookId) => async (dispatch, getState) => {
  try {
    const list = getState().lists.lists.find((l) => l._id === listId);
    
    if (!list) {
      throw new Error('Lista não encontrada');
    }
    
    const updatedBookIds = (list.bookIds || []).filter(id => id !== bookId);
    await RestDB.updateList(listId, { bookIds: updatedBookIds });
    
    dispatch({
      type: types.REMOVE_BOOK_FROM_LIST,
      payload: { listId, bookId },
    });
  } catch (error) {
    console.error('Erro remover da lista:', error);
    throw error;
  }
};