const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = 'AIzaSyA3s2pRI48JezBxsdzOTtogIaZ35CqjPX8'; 

export const searchByTitle = async (title) => {
  try {
    const url = API_KEY 
      ? `${BASE_URL}?q=${encodeURIComponent(title)}&maxResults=20&key=${API_KEY}`
      : `${BASE_URL}?q=${encodeURIComponent(title)}&maxResults=20`;
    
    console.log('🔍 Pesquisando:', title);
    console.log('📡 URL:', url);
    
    const response = await fetch(url);
    
    // LOG DO STATUS DA RESPOSTA
    console.log('📊 Status HTTP:', response.status);
    console.log('📋 Headers:', JSON.stringify(response.headers));
    
    if (!response.ok) {
      // CAPTURA O ERRO DETALHADO DA API
      const errorText = await response.text();
      console.error('❌ Resposta de erro:', errorText);
      
      // ERROS ESPECÍFICOS
      if (response.status === 403) {
        throw new Error('API Key inválida ou quota excedida. Verifica a tua chave da Google Books API.');
      }
      if (response.status === 400) {
        throw new Error('Pedido inválido. Verifica o termo de pesquisa.');
      }
      if (response.status === 429) {
        throw new Error('Muitos pedidos. Aguarda alguns minutos e tenta novamente.');
      }
      if (response.status >= 500) {
        throw new Error('Serviço temporariamente indisponível. Tenta novamente mais tarde.');
      }
      
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    console.log('✅ Resposta recebida:', data.totalItems || 0, 'resultados');
    
    if (!data.items || data.items.length === 0) {
      console.log('⚠️ Nenhum resultado encontrado');
      return [];
    }

    const books = data.items.map((item) => {
      const volumeInfo = item.volumeInfo;
      
      return {
        id: item.id,
        
        title: volumeInfo.title || 'Sem título',
        subtitle: volumeInfo.subtitle || '',
        author: volumeInfo.authors?.[0] || 'Autor desconhecido',
        authors: volumeInfo.authors || [],
        author_name: volumeInfo.authors || [],
        
        thumbnail: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
        cover: volumeInfo.imageLinks?.large?.replace('http:', 'https:') || 
               volumeInfo.imageLinks?.medium?.replace('http:', 'https:') ||
               volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
        coverUrl: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,

        pageCount: volumeInfo.pageCount || 0,
        pages: volumeInfo.pageCount || 0,
        number_of_pages_median: volumeInfo.pageCount || 0,

        isbn: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ||
              volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || null,
        isbn_13: [volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier].filter(Boolean),

        publishedDate: volumeInfo.publishedDate || '',
        publishYear: volumeInfo.publishedDate?.split('-')[0] || '',
        first_publish_year: volumeInfo.publishedDate?.split('-')[0] || '',
        publish_year: [volumeInfo.publishedDate?.split('-')[0]].filter(Boolean),
 
        publisher: [volumeInfo.publisher || ''],

        language: [volumeInfo.language || 'pt'],

        subject: volumeInfo.categories || [],
        categories: volumeInfo.categories?.join(', ') || '',

        description: volumeInfo.description || '',

        rating: volumeInfo.averageRating || 0,
        ratingsCount: volumeInfo.ratingsCount || 0,

        infoLink: volumeInfo.infoLink || '',
        previewLink: volumeInfo.previewLink || '',

        status: 'unread',
        isFavorite: false,
        isWishlist: false,
        currentPage: 0,
        current_page: 0,
        progress: 0,
        notes: '',
      };
    });
    
    console.log('📚 Livros processados:', books.length);
    return books;
    
  } catch (error) {
    console.error('❌ ERRO DETALHADO em searchByTitle:', error);
    
    // SE FOR ERRO DE REDE
    if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
      throw new Error('Sem conexão à Internet. Verifica a tua ligação e tenta novamente.');
    }
    
    // REPASSAR O ERRO COM MAIS CONTEXTO
    throw new Error(error.message || 'Erro desconhecido ao buscar livros');
  }
};

export const searchByISBN = async (isbn) => {
  try {
    const url = API_KEY
      ? `${BASE_URL}?q=isbn:${isbn}&key=${API_KEY}`
      : `${BASE_URL}?q=isbn:${isbn}`;
    
    console.log('🔍 Pesquisando ISBN:', isbn);
    console.log('📡 URL:', url);
    
    const response = await fetch(url);
    
    console.log('📊 Status HTTP:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Resposta de erro:', errorText);
      
      if (response.status === 403) {
        throw new Error('API Key inválida ou quota excedida.');
      }
      if (response.status === 429) {
        throw new Error('Muitos pedidos. Aguarda alguns minutos.');
      }
      
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Livro não encontrado com este ISBN');
    }

    const item = data.items[0];
    const volumeInfo = item.volumeInfo;
    
    return {
      id: item.id,
      title: volumeInfo.title || 'Sem título',
      subtitle: volumeInfo.subtitle || '',
      author: volumeInfo.authors?.[0] || 'Autor desconhecido',
      authors: volumeInfo.authors || [],
      author_name: volumeInfo.authors || [],
      thumbnail: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
      cover: volumeInfo.imageLinks?.large?.replace('http:', 'https:') || 
             volumeInfo.imageLinks?.medium?.replace('http:', 'https:') ||
             volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
      coverUrl: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
      pageCount: volumeInfo.pageCount || 0,
      pages: volumeInfo.pageCount || 0,
      number_of_pages_median: volumeInfo.pageCount || 0,
      isbn: isbn,
      isbn_13: [volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier].filter(Boolean),
      publishedDate: volumeInfo.publishedDate || '',
      publishYear: volumeInfo.publishedDate?.split('-')[0] || '',
      first_publish_year: volumeInfo.publishedDate?.split('-')[0] || '',
      publish_year: [volumeInfo.publishedDate?.split('-')[0]].filter(Boolean),
      publisher: [volumeInfo.publisher || ''],
      language: [volumeInfo.language || 'pt'],
      subject: volumeInfo.categories || [],
      categories: volumeInfo.categories?.join(', ') || '',
      description: volumeInfo.description || '',
      rating: volumeInfo.averageRating || 0,
      ratingsCount: volumeInfo.ratingsCount || 0,
      infoLink: volumeInfo.infoLink || '',
      previewLink: volumeInfo.previewLink || '',
      status: 'unread',
      isFavorite: false,
      isWishlist: false,
      currentPage: 0,
      current_page: 0,
      progress: 0,
      notes: '',
    };
  } catch (error) {
    console.error('❌ ERRO DETALHADO em searchByISBN:', error);
    
    if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
      throw new Error('Sem conexão à Internet.');
    }
    
    throw error;
  }
};

export const getBookDetails = async (bookId) => {
  try {
    const url = API_KEY
      ? `${BASE_URL}/${bookId}?key=${API_KEY}`
      : `${BASE_URL}/${bookId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Erro ao buscar detalhes:', response.status);
      return {
        description: '',
        pageCount: 0,
        categories: [],
        previewLink: '',
      };
    }

    const data = await response.json();
    const volumeInfo = data.volumeInfo;
    
    return {
      description: volumeInfo.description || '',
      pageCount: volumeInfo.pageCount || 0,
      categories: volumeInfo.categories || [],
      previewLink: volumeInfo.previewLink || '',
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error);
    return {
      description: '',
      pageCount: 0,
      categories: [],
      previewLink: '',
    };
  }
};

export default {
  searchByTitle,
  searchByISBN,
  getBookDetails,
};