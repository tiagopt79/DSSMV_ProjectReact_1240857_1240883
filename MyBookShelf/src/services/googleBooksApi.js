const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = 'AIzaSyA3s2pRI48JezBxsdzOTtogIaZ35CqjPX8'; 

export const searchByTitle = async (title) => {
  try {
    const url = API_KEY 
      ? `${BASE_URL}?q=${encodeURIComponent(title)}&maxResults=20&key=${API_KEY}`
      : `${BASE_URL}?q=${encodeURIComponent(title)}&maxResults=20`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar livros');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map((item) => {
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
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw error;
  }
};

export const searchByISBN = async (isbn) => {
  try {
    const url = API_KEY
      ? `${BASE_URL}?q=isbn:${isbn}&key=${API_KEY}`
      : `${BASE_URL}?q=isbn:${isbn}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar livro por ISBN');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Livro não encontrado');
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
    console.error('Erro ao buscar por ISBN:', error);
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
      throw new Error('Erro ao buscar detalhes');
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