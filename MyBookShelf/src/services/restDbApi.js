import { API_KEY, DATABASE_URL } from '../consts/config';

const headers = {
  'Content-Type': 'application/json',
  'x-apikey': API_KEY,
  'cache-control': 'no-cache',
};

const normalizeBook = (book) => {
  const isbn = book.isbn || book.isbn_13?.[0] || book.key?.split('/').pop() || `temp_${Date.now()}`;
  return {
    isbn: isbn,
    title: book.title || 'Sem título',
    author: book.author || book.author_name?.[0] || 'Autor desconhecido',
    cover: book.cover || book.coverUrl || book.thumbnail || '',
    description: book.description?.value || book.description || '',
    publishYear: book.publish_year?.[0] || book.first_publish_year || '',
    pages: book.number_of_pages_median || book.pages || 0,
    rating: book.rating || 0,
    status: book.status || 'wishlist',
    isFavorite: book.isFavorite || false,
    isWishlist: book.isWishlist || false,
    currentPage: book.currentPage || book.current_page || 0,
    current_page: book.current_page || book.currentPage || 0,
    progress: book.progress || 0,
    notes: book.notes || '',
    categories: Array.isArray(book.subject) ? book.subject.join(', ') : (book.categories || ''),
    language: book.language?.[0] || 'pt',
    publisher: book.publisher?.[0] || '',
  };
};


const handleError = (context, error) => {
  console.error(`[RestDB Error] ${context}:`, error.message || error);
  throw error;
};

export const addBook = async (book) => {
  try {
    if (!API_KEY || !DATABASE_URL) throw new Error('Configuração de API ausente');
    const response = await fetch(`${DATABASE_URL}/books`, {
      method: 'POST',
      headers,
      body: JSON.stringify(normalizeBook(book)),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) { handleError('addBook', error); }
};

export const getBooks = async () => {
  try {
    if (!API_KEY || !DATABASE_URL) throw new Error('Configuração de API ausente');
    const response = await fetch(`${DATABASE_URL}/books`, { method: 'GET', headers });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) { handleError('getBooks', error); }
};

export const getBookById = async (id) => {
  try {
    const response = await fetch(`${DATABASE_URL}/books/${id}`, { method: 'GET', headers });
    if (!response.ok) throw new Error(response.status);
    return await response.json();
  } catch (error) { handleError('getBookById', error); }
};

export const updateBook = async (id, updates) => {
  try {
    const currentBook = await getBookById(id);
    const updatedBook = { ...currentBook, ...updates };
    delete updatedBook._id;

    const response = await fetch(`${DATABASE_URL}/books/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatedBook),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) { handleError('updateBook', error); }
};

export const deleteBook = async (id) => {
  try {
    const response = await fetch(`${DATABASE_URL}/books/${id}`, { method: 'DELETE', headers });
    if (!response.ok) throw new Error(response.status);
    return true;
  } catch (error) { handleError('deleteBook', error); }
};

export const getBookByIsbn = async (isbn) => {
  try {
    const response = await fetch(`${DATABASE_URL}/books?q={"isbn":"${isbn}"}`, { method: 'GET', headers });
    if (!response.ok) throw new Error(response.status);
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) { handleError('getBookByIsbn', error); }
};

export const getBooksByStatus = async (status) => {
  try {
    const response = await fetch(`${DATABASE_URL}/books?q={"status":"${status}"}`, { method: 'GET', headers });
    if (!response.ok) throw new Error(response.status);
    return await response.json();
  } catch (error) { handleError('getBooksByStatus', error); }
};

export const getFavoriteBooks = async () => {
  try {
    const response = await fetch(`${DATABASE_URL}/books?q={"isFavorite":true}`, { method: 'GET', headers });
    if (!response.ok) throw new Error(response.status);
    return await response.json();
  } catch (error) { handleError('getFavoriteBooks', error); }
};

export const getReadingSessions = async (bookId) => {
  try {
    const response = await fetch(`${DATABASE_URL}/readingsessions?q={"bookId":"${bookId}"}&sort=date&dir=-1`, { method: 'GET', headers });
    if (!response.ok) throw new Error(response.status);
    return await response.json();
  } catch (error) { handleError('getReadingSessions', error); }
};

export const addReadingSession = async (sessionData) => {
  try {
    const response = await fetch(`${DATABASE_URL}/readingsessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sessionData),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) { handleError('addReadingSession', error); }
};

export const updateBookProgress = async (bookId, newPage) => {
  try {
    const currentBook = await getBookById(bookId);
    const progress = currentBook.pages > 0 
      ? Math.min(Math.round((newPage / currentBook.pages) * 100), 100)
      : 0;
    
    const updatedBook = {
      ...currentBook,
      currentPage: newPage,
      current_page: newPage,
      progress: progress,
      last_read: new Date().toISOString(),
    };
    delete updatedBook._id;

    const response = await fetch(`${DATABASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatedBook),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) { handleError('updateBookProgress', error); }
};

export const getLists = async () => {
  try {
    const response = await fetch(`${DATABASE_URL}/lists`, { method: 'GET', headers });
    if (!response.ok) throw new Error(response.status);
    return await response.json();
  } catch (error) { handleError('getLists', error); }
};

export const getListById = async (listId) => {
  try {
    const response = await fetch(`${DATABASE_URL}/lists/${listId}`, { method: 'GET', headers });
    if (!response.ok) throw new Error('Lista não encontrada');
    return await response.json();
  } catch (error) { handleError('getListById', error); }
};

export const createList = async (listData) => {
  try {
    const newList = {
      name: listData.name,
      description: listData.description || '',
      color: listData.color || '#2A5288',
      icon: listData.icon || 'list',
      bookIds: [],
      bookCount: 0,
      createdAt: new Date().toISOString(),
    };
    const response = await fetch(`${DATABASE_URL}/lists`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newList),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) { handleError('createList', error); }
};

export const deleteList = async (listId) => {
  try {
    const response = await fetch(`${DATABASE_URL}/lists/${listId}`, { method: 'DELETE', headers });
    if (!response.ok) throw new Error(response.status);
    return true;
  } catch (error) { handleError('deleteList', error); }
};

export const updateList = async (listId, updates) => {
  try {
    const currentList = await getListById(listId);
    const updatedList = { ...currentList, ...updates };
    delete updatedList._id;
    const response = await fetch(`${DATABASE_URL}/lists/${listId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatedList),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) { handleError('updateList', error); }
};

export const getBooksFromList = async (listId) => {
  try {
    const list = await getListById(listId);
    if (!list.bookIds || list.bookIds.length === 0) return [];
    const books = await Promise.all(list.bookIds.map(bookId => getBookById(bookId)));
    return books.filter(book => book !== null);
  } catch (error) { handleError('getBooksFromList', error); }
};

export const addBookToList = async (listId, bookId) => {
  try {
    const list = await getListById(listId);
    if (list.bookIds && list.bookIds.includes(bookId)) throw new Error('Livro já na lista');
    const updatedBookIds = [...(list.bookIds || []), bookId];
    return await updateList(listId, { bookIds: updatedBookIds, bookCount: updatedBookIds.length });
  } catch (error) { handleError('addBookToList', error); }
};

export const removeBookFromList = async (listId, bookId) => {
  try {
    const list = await getListById(listId);
    const updatedBookIds = (list.bookIds || []).filter(id => id !== bookId);
    return await updateList(listId, { bookIds: updatedBookIds, bookCount: updatedBookIds.length });
  } catch (error) { handleError('removeBookFromList', error); }
};


export const toggleFavorite = (id, isFavorite) => updateBook(id, { isFavorite });
export const updateBookStatus = (id, status) => updateBook(id, { status });