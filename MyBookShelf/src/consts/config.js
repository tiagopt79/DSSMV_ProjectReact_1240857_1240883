export const API_KEY = '55832e3e87b83972153b7a8de3350452f3560';
export const DATABASE_URL = 'https://mybookshelf-49a2.restdb.io/rest';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyA3s2pRI48JezBxsdzOTtogIaZ35CqjPX8';
export const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const ITEMS_PER_PAGE = 20;
export const MAX_SEARCH_RESULTS = 50;

export const COLORS = {
  primary: '#2A5288',
  secondary: '#7B1FA2',
  background: '#E8D5A8',
  white: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  success: '#4CAF50',
  error: '#D32F2F',
  warning: '#FF9800',
};


export const isConfigured = () => {
  const hasApiKey = API_KEY && API_KEY !== '55832e3e87b83972153b7a8de3350452f3560';
  const hasDbUrl = DATABASE_URL && DATABASE_URL !== 'https://mybookshelf-49a2.restdb.io/rest';
  
  return hasApiKey && hasDbUrl;
};

export const getConfigStatus = () => {
  const hasApiKey = API_KEY && API_KEY !== '55832e3e87b83972153b7a8de3350452f3560';
  const hasDbUrl = DATABASE_URL && DATABASE_URL !== 'https://mybookshelf-49a2.restdb.io/rest';
  
  return {
    apiKey: hasApiKey ? '✅ Configurada' : '❌ Falta configurar',
    databaseUrl: hasDbUrl ? '✅ Configurada' : '❌ Falta configurar',
    isReady: hasApiKey && hasDbUrl,
  };
};