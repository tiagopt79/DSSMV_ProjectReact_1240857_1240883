import { API_KEY, DATABASE_URL } from '../consts/config';

const headers = {
  'Content-Type': 'application/json',
  'x-apikey': API_KEY,
  'cache-control': 'no-cache',
};

const logDebug = (operation, data) => {
  console.log(`\n[RestDB] ${operation}`);
  console.log('Data:', JSON.stringify(data, null, 2));
  console.log('API Key:', API_KEY ? 'Configurada' : 'FALTA');
  console.log('URL:', DATABASE_URL);
};

const logError = (operation, error) => {
  console.error(`\n[RestDB Error] ${operation}`);
  console.error('Error:', error);
  console.error('Message:', error.message);
};

const normalizeBook = (book) => {
  const isbn = book.isbn || book.isbn_13?.[0] || book.key?.split('/').pop() || `temp_${Date.now()}`;
  
  return {
    isbn: isbn,
    title: book.title || 'Sem título',
    author: book.author || book.author_name?.[0] || 'Autor desconhecido',
    coverUrl: book.coverUrl || 
              (book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : ''),
    description: book.description?.value || book.description || '',
    publishYear: book.publish_year?.[0] || book.first_publish_year || '',
    pages: book.number_of_pages_median || book.pages || 0,
    rating: book.rating || 0,
    status: book.status || 'wishlist',
    isFavorite: book.isFavorite || false,
    currentPage: book.currentPage || 0,
    notes: book.notes || '',
    categories: Array.isArray(book.subject) ? book.subject.join(', ') : (book.categories || ''),
    language: book.language?.[0] || 'pt',
    publisher: book.publisher?.[0] || '',
  };
};

export const addBook = async (book) => {
  try {
    logDebug('ADICIONAR LIVRO', book);

    if (!API_KEY || !DATABASE_URL) {
      throw new Error('API_KEY ou DATABASE_URL não configurados no config.js');
    }

    const normalizedBook = normalizeBook(book);
    logDebug('LIVRO NORMALIZADO', normalizedBook);

    const url = `${DATABASE_URL}/books`;
    console.log('POST para:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(normalizedBook),
    });

    console.log('Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Livro adicionado:', data);
    return data;

  } catch (error) {
    logError('ADICIONAR LIVRO', error);
    throw error;
  }
};

export const getBooks = async () => {
  try {
    logDebug('BUSCAR LIVROS', {});

    if (!API_KEY || !DATABASE_URL) {
      throw new Error('API_KEY ou DATABASE_URL não configurados');
    }

    const url = `${DATABASE_URL}/books`;
    console.log('GET de:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log('Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`${data.length} livros encontrados`);
    return data;

  } catch (error) {
    logError('BUSCAR LIVROS', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    logDebug('BUSCAR LIVRO POR ID', { id });

    const url = `${DATABASE_URL}/books/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Livro encontrado:', data);
    return data;

  } catch (error) {
    logError('BUSCAR LIVRO POR ID', error);
    throw error;
  }
};

export const updateBook = async (id, updates) => {
  try {
    logDebug('ATUALIZAR LIVRO', { id, updates });

    const url = `${DATABASE_URL}/books/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Livro atualizado:', data);
    return data;

  } catch (error) {
    logError('ATUALIZAR LIVRO', error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    logDebug('DELETAR LIVRO', { id });

    const url = `${DATABASE_URL}/books/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    console.log('Livro deletado');
    return true;

  } catch (error) {
    logError('DELETAR LIVRO', error);
    throw error;
  }
};

export const getBookByIsbn = async (isbn) => {
  try {
    logDebug('BUSCAR POR ISBN', { isbn });

    const url = `${DATABASE_URL}/books?q={"isbn":"${isbn}"}`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Resultado:', data.length > 0 ? 'Encontrado' : 'Não encontrado');
    return data.length > 0 ? data[0] : null;

  } catch (error) {
    logError('BUSCAR POR ISBN', error);
    throw error;
  }
};

export const getBooksByStatus = async (status) => {
  try {
    logDebug('BUSCAR POR STATUS', { status });

    const url = `${DATABASE_URL}/books?q={"status":"${status}"}`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`${data.length} livros com status '${status}'`);
    return data;

  } catch (error) {
    logError('BUSCAR POR STATUS', error);
    throw error;
  }
};

export const getFavoriteBooks = async () => {
  try {
    logDebug('BUSCAR FAVORITOS', {});

    const url = `${DATABASE_URL}/books?q={"isFavorite":true}`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`${data.length} favoritos encontrados`);
    return data;

  } catch (error) {
    logError('BUSCAR FAVORITOS', error);
    throw error;
  }
};

export const toggleFavorite = async (id, isFavorite) => {
  try {
    logDebug('TOGGLE FAVORITO', { id, isFavorite });
    return await updateBook(id, { isFavorite });
  } catch (error) {
    logError('TOGGLE FAVORITO', error);
    throw error;
  }
};

export const updateBookStatus = async (id, status) => {
  try {
    logDebug('ATUALIZAR STATUS', { id, status });
    return await updateBook(id, { status });
  } catch (error) {
    logError('ATUALIZAR STATUS', error);
    throw error;
  }
};

export const getReadingSessions = async (bookId) => {
  try {
    logDebug('BUSCAR HISTÓRICO', { bookId });

    const url = `${DATABASE_URL}/readingsessions?q={"bookId":"${bookId}"}&sort=date&dir=-1`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`${data.length} sessões encontradas`);
    return data;

  } catch (error) {
    logError('BUSCAR HISTÓRICO', error);
    throw error;
  }
};

export const addReadingSession = async (sessionData) => {
  try {
    logDebug('ADICIONAR SESSÃO', sessionData);

    const url = `${DATABASE_URL}/readingsessions`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Sessão adicionada:', data);
    return data;

  } catch (error) {
    logError('ADICIONAR SESSÃO', error);
    throw error;
  }
};