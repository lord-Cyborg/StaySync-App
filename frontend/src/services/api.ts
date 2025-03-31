import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3003/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detalhado do erro
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      requestData: error.config?.data
    });

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }

    // Adiciona mensagem de erro mais detalhada
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    error.userMessage = `Erro na operação: ${errorMessage}`;
    
    return Promise.reject(error);
  }
);

export const propertiesApi = {
  getAll: () => api.get('/properties'),
  getOne: (id: string) => api.get(`/properties/${id}`),
  create: (data: any) => api.post('/properties', data),
  update: (id: string, data: any) => api.put(`/properties/${id}`, data),
  delete: (id: string) => api.delete(`/properties/${id}`),
  cloneImages: (sourceId: string, targetId: string) => 
    api.post(`/properties/${sourceId}/clone-images`, { targetId }),
  ensureDirectories: (propertyId: string) => 
    api.post(`/properties/${propertyId}/ensure-directories`)
};

export const inventoryApi = {
  // Catálogo
  getCatalog: () => api.get('/inventory/catalog/items'),
  getCatalogItem: (id: string) => api.get(`/inventory/catalog/items/${id}`),
  createCatalogItem: (data: any) => api.post('/inventory/catalog/items', data),
  updateCatalogItem: (id: string, data: any) => api.put(`/inventory/catalog/items/${id}`, data),
  deleteCatalogItem: (id: string) => api.delete(`/inventory/catalog/items/${id}`),

  // Inventário de Propriedade
  getPropertyInventory: (propertyId: string) => api.get(`/inventory/propertyInventories/${propertyId}`),
  addPropertyItem: (propertyId: string, data: any) => api.post(`/inventory/propertyInventories/${propertyId}/items`, data),
  updatePropertyItem: (propertyId: string, itemId: string, data: any) => 
    api.put(`/inventory/propertyInventories/${propertyId}/items/${itemId}`, data),
  deletePropertyItem: (propertyId: string, itemId: string) => 
    api.delete(`/inventory/propertyInventories/${propertyId}/items/${itemId}`),

  // Grupos
  getGroups: () => api.get('/inventory/groups'),
  getGroupItems: (groupId: string) => api.get(`/inventory/groups/${groupId}/itemIds`)
};

export default api;
