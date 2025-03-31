import api from './api';

export interface PropertyImage {
  id: string;
  path: string;
  category: string;
  order: number;
}

export interface PropertyData {
  id: string;
  mainImage: string;
  propertyId: string;
  gateCode: string;
  doorCode: string;
  wifiPassword: string;
  address: string;
  addressNumber: string;
  addressStreet: string;
  status: InspectionStatus;
  images: PropertyImage[];
  _imageFile?: File;
}

export interface Property extends PropertyData {
  createdAt: string;
}

export type InspectionStatus = 'ok' | 'attention' | 'problem';

export const propertyService = {
  // Função auxiliar para gerar o caminho da imagem
  getImagePath(id: string) {
    return `/images/${id}/gallery/main-${id}.JPG`;
  },

  // Buscar todas as propriedades
  async getProperties(): Promise<Property[]> {
    try {
      console.log('Fetching all properties');
      const response = await api.get('/properties');
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  // Buscar uma propriedade específica
  async getProperty(id: string): Promise<PropertyData | null> {
    try {
      console.log('Buscando propriedade:', id);
      const response = await api.get(`/properties/${id}`);
      console.log('Resposta:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar propriedade:', {
        error,
        message: error.message,
        response: error.response?.data
      });
      return null;
    }
  },

  // Criar nova propriedade
  async createProperty(data: PropertyData): Promise<PropertyData> {
    try {
      console.log('Creating property with data:', data);
      const response = await api.post('/properties', data);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  // Atualizar propriedade existente
  async updateProperty(id: string, data: Partial<PropertyData>): Promise<PropertyData> {
    try {
      console.log('Updating property:', id, 'with data:', data);
      
      // If there's an image file, upload it first
      if (data._imageFile) {
        const imagePath = await this.uploadImage(data._imageFile, id);
        data.mainImage = imagePath;
        delete data._imageFile;
      }
      
      const response = await api.put(`/properties/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  // Upload de imagem (salva localmente)
  async uploadImage(file: File, propertyId: string): Promise<string> {
    try {
      console.log('Uploading image for property:', propertyId);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('isMain', 'true');
      
      // Primeiro garantir que os diretórios existam
      await this.ensureImageDirectories(propertyId);

      // Tentar fazer o upload
      const response = await api.post(`/api/properties/${propertyId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      
      if (response.data.success) {
        return response.data.path;
      } else {
        throw new Error(response.data.error || 'Falha ao fazer upload da imagem');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Retornar o caminho esperado mesmo com erro
      return `/images/${propertyId}/gallery/main-${propertyId}.JPG`;
    }
  },

  // Upload de múltiplas imagens
  async uploadImages(files: File[], propertyId: string): Promise<PropertyImage[]> {
    try {
      console.log('Uploading multiple images for property:', propertyId);
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('images', file);
      });

      const response = await api.post(`/properties/${propertyId}/upload-multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Garantir que os diretórios de imagens existam
  async ensureImageDirectories(propertyId: string): Promise<void> {
    try {
      await api.post(`/properties/${propertyId}/ensure-directories`);
    } catch (error) {
      console.error('Erro ao criar diretórios:', error);
      throw error;
    }
  },

  // Clonar imagens de uma propriedade
  async cloneImages(sourceId: string, targetId: string): Promise<void> {
    try {
      console.log('Clonando imagens:', { sourceId, targetId });
      
      // Primeiro, garante que os diretórios existem
      await this.ensureImageDirectories(targetId);
      
      // Depois, clona as imagens
      const response = await api.post(`/properties/${sourceId}/clone-images`, { 
        targetId,
        sourceId
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Falha ao clonar imagens');
      }
      
      console.log('Imagens clonadas com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao clonar imagens:', {
        error,
        sourceId,
        targetId,
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  },

  // Deletar propriedade
  async deleteProperty(id: string): Promise<void> {
    try {
      console.log('Deleting property:', id);
      await api.delete(`/properties/${id}`);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },

  // Função para fazer upload da imagem principal
  async uploadMainImage(propertyId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('isMain', 'true');

    try {
      const response = await api.post(`${api.defaults.baseURL}/properties/${propertyId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data.path;
      } else {
        throw new Error(response.data.error || 'Falha ao fazer upload da imagem');
      }
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      throw error;
    }
  },

  // Função para fazer upload de múltiplas imagens
  async uploadImagesFiles(propertyId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await api.post(`${api.defaults.baseURL}/properties/${propertyId}/upload-multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data.images.map((img: any) => img.path);
      } else {
        throw new Error(response.data.error || 'Falha ao fazer upload das imagens');
      }
    } catch (error) {
      console.error('Erro no upload das imagens:', error);
      throw error;
    }
  }
};

export default propertyService;
