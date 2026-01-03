// src/consts/config.js

// ========================================
// 🔐 CONFIGURAÇÃO DA API RESTDB
// ========================================

// 📝 INSTRUÇÕES:
// 1. Acesse: https://restdb.io
// 2. Faça login (ou crie conta gratuita)
// 3. Abra seu database
// 4. Vá em Settings (⚙️) → API
// 5. Copie a "API Key" e cole abaixo
// 6. Copie o "REST API URL" e cole abaixo

// ⚠️ IMPORTANTE: Substitua os valores abaixo pelos SEUS valores reais!

export const API_KEY = '55832e3e87b83972153b7a8de3350452f3560';
export const DATABASE_URL = 'https://mybookshelf-49a2.restdb.io/rest';

// ========================================
// 📚 CONFIGURAÇÃO DA OPENLIBRARY
// ========================================

export const OPENLIBRARY_BASE_URL = 'https://openlibrary.org';
export const OPENLIBRARY_COVERS_URL = 'https://covers.openlibrary.org/b';
export const API_TIMEOUT = 15000;

// ========================================
// 📱 CONFIGURAÇÕES DO APP
// ========================================

export const ITEMS_PER_PAGE = 20;
export const MAX_SEARCH_RESULTS = 50;

// ========================================
// 🎨 TEMA
// ========================================

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

// ========================================
// ✅ VALIDAÇÃO (NÃO MEXER)
// ========================================

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