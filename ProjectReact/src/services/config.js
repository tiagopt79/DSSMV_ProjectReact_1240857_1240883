export const RESTDB_CONFIG = {
  API_KEY: '55832e3e87b83972153b7a8de3350452f3560',
  DATABASE_URL: 'https://mybookshelf-49a2.restdb.io/rest', 
};

export const OPENLIBRARY_CONFIG = {
  BASE_URL: 'https://openlibrary.org',
  COVERS_URL: 'https://covers.openlibrary.org/b',
  SEARCH_URL: 'https://openlibrary.org/search.json',
};

export const RESTDB_HEADERS = {
  'Content-Type': 'application/json',
  'x-apikey': RESTDB_CONFIG.API_KEY,
  'cache-control': 'no-cache',
};