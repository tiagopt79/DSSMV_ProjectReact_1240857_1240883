import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

import booksReducer from './reducers/booksReducer';
import listsReducer from './reducers/listsReducer';

const rootReducer = combineReducers({
  books: booksReducer,
  lists: listsReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

console.log('✅ Redux Store criado com sucesso!');

export default store;