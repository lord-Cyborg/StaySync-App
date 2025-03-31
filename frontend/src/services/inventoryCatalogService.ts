import axios from 'axios';
import { 
  CatalogItem, 
  PropertyInventoryItem, 
  InventoryFilter,
  InventoryTemplate,
  TemplateType
} from '../types/inventory-catalog';

const API_URL = 'http://localhost:3004/api/inventory';

export const inventoryCatalogService = {
  // Catalog Management
  async getCatalogItems(filter?: InventoryFilter): Promise<CatalogItem[]> {
    try {
      const response = await axios.get(`${API_URL}/catalog`, { params: filter });
      return response.data;
    } catch (error) {
      console.error('Error fetching catalog items:', error);
      throw error;
    }
  },

  async getCatalogItem(id: string): Promise<CatalogItem> {
    try {
      const response = await axios.get(`${API_URL}/catalog/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching catalog item:', error);
      throw error;
    }
  },

  async createCatalogItem(item: Omit<CatalogItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<CatalogItem> {
    try {
      const response = await axios.post(`${API_URL}/catalog`, item);
      return response.data;
    } catch (error) {
      console.error('Error creating catalog item:', error);
      throw error;
    }
  },

  async updateCatalogItem(id: string, item: Partial<CatalogItem>): Promise<CatalogItem> {
    try {
      const response = await axios.patch(`${API_URL}/catalog/${id}`, item);
      return response.data;
    } catch (error) {
      console.error('Error updating catalog item:', error);
      throw error;
    }
  },

  // Template Management
  async getTemplates(type: TemplateType): Promise<InventoryTemplate[]> {
    try {
      const response = await axios.get(`${API_URL}/templates/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  async createTemplate(template: Omit<InventoryTemplate, 'id'>): Promise<InventoryTemplate> {
    try {
      const response = await axios.post(`${API_URL}/templates`, template);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  async shareTemplate(templateId: string, propertyIds: string[]): Promise<void> {
    try {
      await axios.post(`${API_URL}/templates/${templateId}/share`, { propertyIds });
    } catch (error) {
      console.error('Error sharing template:', error);
      throw error;
    }
  },

  // Property Inventory Management
  async getPropertyInventoryItems(
    propertyId: string, 
    filter?: InventoryFilter
  ): Promise<PropertyInventoryItem[]> {
    try {
      const response = await axios.get(`${API_URL}/${propertyId}/items`, { 
        params: { 
          ...filter,
          includeSubItems: true  // Sempre incluir sub-itens
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching property items:', error);
      throw error;
    }
  },

  async addItemToProperty(
    propertyId: string,
    catalogItemId: string,
    data: Omit<PropertyInventoryItem, 'id' | 'catalogItemId' | 'propertyId'>
  ): Promise<PropertyInventoryItem> {
    try {
      const response = await axios.post(`${API_URL}/${propertyId}/items`, {
        catalogItemId,
        ...data,
        // Se baseado em template, incluir sub-itens padrão
        includeTemplateSubItems: !!data.templateId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding item to property:', error);
      throw error;
    }
  },

  async updatePropertyItem(
    propertyId: string,
    itemId: string,
    data: Partial<PropertyInventoryItem>
  ): Promise<PropertyInventoryItem> {
    try {
      const response = await axios.patch(
        `${API_URL}/${propertyId}/items/${itemId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating property item:', error);
      throw error;
    }
  },

  async clonePropertyItem(
    propertyId: string,
    itemId: string,
    modifications: Partial<PropertyInventoryItem>
  ): Promise<PropertyInventoryItem> {
    try {
      const response = await axios.post(
        `${API_URL}/${propertyId}/items/${itemId}/clone`,
        modifications
      );
      return response.data;
    } catch (error) {
      console.error('Error cloning property item:', error);
      throw error;
    }
  },

  async removeItemFromProperty(propertyId: string, itemId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${propertyId}/items/${itemId}`);
    } catch (error) {
      console.error('Error removing item from property:', error);
      throw error;
    }
  },

  // Clonar inventário de uma propriedade
  async clonePropertyInventory(sourcePropertyId: string, targetPropertyId: string): Promise<void> {
    try {
      console.log(`Iniciando clonagem do inventário de ${sourcePropertyId} para ${targetPropertyId}`);
      
      const response = await axios.post(
        `${API_URL}/${sourcePropertyId}/clone`,
        { targetPropertyId }
      );
      
      console.log('Resposta da clonagem:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Falha ao clonar inventário');
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao clonar inventário:', {
        error,
        message: error.message,
        sourceId: sourcePropertyId,
        targetId: targetPropertyId,
        response: error.response?.data
      });
      throw error;
    }
  },

  // Deletar inventário de uma propriedade
  async deletePropertyInventory(propertyId: string): Promise<void> {
    try {
      console.log(`Deletando inventário da propriedade ${propertyId}`);
      const response = await axios.delete(`${API_URL}/${propertyId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Falha ao deletar inventário');
      }
      
      console.log('Inventário deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar inventário:', error);
      throw error;
    }
  },

  // Sub-Item Management
  async addSubItem(
    propertyId: string,
    parentItemId: string,
    subItem: Omit<PropertyInventoryItem, 'id' | 'propertyId' | 'parentItemId'>
  ): Promise<PropertyInventoryItem> {
    try {
      // Usa a mesma rota de adicionar item normal, apenas incluindo o parentId
      const response = await axios.post(
        `${API_URL}/propertyInventories/${propertyId}/items`,
        {
          ...subItem,
          parentId: parentItemId
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding sub-item:', error);
      throw error;
    }
  },

  async getSubItems(propertyId: string, parentItemId: string): Promise<PropertyInventoryItem[]> {
    try {
      // Busca todos os itens e filtra pelos que têm o parentId correto
      const response = await axios.get(
        `${API_URL}/propertyInventories/${propertyId}/items`
      );
      return response.data.filter((item: PropertyInventoryItem) => 
        item.parentId === parentItemId
      );
    } catch (error) {
      console.error('Error fetching sub-items:', error);
      throw error;
    }
  },

  async removeSubItem(propertyId: string, parentItemId: string, subItemId: string): Promise<void> {
    try {
      // Remove como um item normal
      await axios.delete(
        `${API_URL}/propertyInventories/${propertyId}/items/${subItemId}`
      );
    } catch (error) {
      console.error('Error removing sub-item:', error);
      throw error;
    }
  }
};

export default inventoryCatalogService;
