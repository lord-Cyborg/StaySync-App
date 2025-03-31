import api from './api';

export interface ExternalProperty {
  idAirbnb: string;
  id: string;
  url: string;
  title: string;
  platform: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  maxGuests: number;
  amenities: string[];
  photos: Record<string, string>;
  host: {
    name: string;
    isSuperhost: boolean;
  };
  location: {
    address: string;
    city: string;
    country: string;
  };
}

export const externalDbService = {
  // Buscar todas as propriedades do banco externo
  async getProperties(): Promise<ExternalProperty[]> {
    try {
      console.log('Buscando propriedades externas...');
      // O axios já está configurado com baseURL: 'http://localhost:3003/api'
      const response = await api.get('/external-properties');
      console.log(`Recebidas ${response.data.length} propriedades externas`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar propriedades externas:', error);
      console.error('Detalhes do erro:', error.message);
      if (error.response) {
        console.error('Resposta do servidor:', error.response.data);
      }
      throw error;
    }
  },
  
  // Buscar uma propriedade específica
  async getProperty(id: string): Promise<ExternalProperty | null> {
    try {
      const response = await api.get(`/external-properties/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar propriedade externa:', error);
      console.error('Detalhes do erro:', error.message);
      return null;
    }
  }
};

export default externalDbService;
