// src/flux/store.js - VERSÃO CORRIGIDA
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Importa os reducers
import booksReducer from './reducers/booksReducer';
import listsReducer from './reducers/listsReducer';
import readingProgressReducer from './reducers/readingProgressReducer';

// Combina todos os reducers
const rootReducer = combineReducers({
  books: booksReducer,
  lists: listsReducer,
  readingProgress: readingProgressReducer,
});

// Cria o store com middleware thunk
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

// TESTE: Log para verificar que o store foi criado
console.log('✅ Redux Store criado com sucesso!');
console.log('Estado inicial:', store.getState());

export default store;