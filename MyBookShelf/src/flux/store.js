import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import booksReducer from './reducers/booksReducer';
import listsReducer from './reducers/listsReducer';
import readingProgressReducer from './reducers/readingProgressReducer';

const rootReducer = combineReducers({
  books: booksReducer,
  lists: listsReducer,
  readingProgress: readingProgressReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

console.log('✅ Redux Store criado com sucesso!');
console.log('Estado inicial:', store.getState());

export default store;