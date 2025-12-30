import { 
  SEARCH_BOOKS, 
  TOGGLE_FAVORITE, 
  TOGGLE_WISHLIST, 
  ADD_TO_LIBRARY 
} from '../actions';

// Estado Inicial (vazio ou com dados de teste)
const initialState = {
  searchResults: [], // Lista da pesquisa
  myLibrary: [],     // Minha Biblioteca (Botão Roxo Grande)
  favorites: [],     // Favoritos (Coração)
  wishlist: [],      // Lista de Desejos
  readingNow: [],    // Livros em Leitura (Painel do Topo)
};

const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_BOOKS:
      return {
        ...state,
        searchResults: action.payload,
      };

    case ADD_TO_LIBRARY:
      // Verifica se o livro já existe para não duplicar
      if (state.myLibrary.find(book => book.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        myLibrary: [...state.myLibrary, action.payload],
      };

    case TOGGLE_FAVORITE:
      // Se já existe, remove. Se não existe, adiciona.
      const isFavorite = state.favorites.find(book => book.id === action.payload.id);
      if (isFavorite) {
        return {
          ...state,
          favorites: state.favorites.filter(book => book.id !== action.payload.id),
        };
      } else {
        return {
          ...state,
          favorites: [...state.favorites, action.payload],
        };
      }

    case TOGGLE_WISHLIST:
      const inWishlist = state.wishlist.find(book => book.id === action.payload.id);
      if (inWishlist) {
        return {
          ...state,
          wishlist: state.wishlist.filter(book => book.id !== action.payload.id),
        };
      } else {
        return {
          ...state,
          wishlist: [...state.wishlist, action.payload],
        };
      }

    default:
      return state;
  }
};

export default bookReducer;