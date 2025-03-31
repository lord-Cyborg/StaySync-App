// Inventory Category Types
export type INVENTORY_CategoryType =
  | 'Furniture'
  | 'Bed Linen'
  | 'Electronics'
  | 'Lighting'
  | 'Floor-Carpet'
  | 'Wall'
  | 'Towels'
  | 'Bathroom'
  | 'Kitchen';

// Area Types
export type INVENTORY_AreaType = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'game' | 'all';

// Status e Severity
export type INVENTORY_ItemStatus = 'ok' | 'attention' | 'problem';
export type INVENTORY_ItemSeverity = 'low' | 'medium' | 'high';

// Template Types
export type INVENTORY_TemplateType = 'global' | 'property' | 'instance';

// Item Types
export interface INVENTORY_BaseInventoryItem {
  id: string;
  name: string;
  category: INVENTORY_CategoryType;
  status: INVENTORY_ItemStatus;
  notes?: string;
  quantity: number;
  currentValue?: number;
  updatedAt?: Date;
  createdAt?: Date;
}

// Template que pode ser compartilhado entre propriedades
export interface INVENTORY_InventoryTemplate extends INVENTORY_BaseInventoryItem {
  type: INVENTORY_TemplateType;
  sharedWith?: string[];  // IDs das propriedades que podem usar
  defaultSubItems?: string[];  // IDs dos sub-itens padrão
}

// Item específico de uma propriedade
export interface INVENTORY_PropertyInventoryItem extends INVENTORY_BaseInventoryItem {
  catalogItemId: string;
  propertyId: string;
  roomId: string;
  parentItemId?: string;  // Se for sub-item, ID do item pai
  templateId?: string;    // Se baseado em template
  isTemplate?: boolean;   // Se este item serve como template
  customizations?: {
    color?: string;
    additions?: string[];
    [key: string]: any;
  };
  overrides?: {          // Sobrescreve valores do template
    status?: INVENTORY_ItemStatus;
    notes?: string;
    quantity?: number;
    [key: string]: any;
  };
}

// Specification Types
export interface INVENTORY_Specification {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  type: 'text' | 'number' | 'dimension' | 'currency' | 'serial';
}

// Category Group Definition
export type INVENTORY_CategoryGroups = Record<INVENTORY_AreaType, INVENTORY_CategoryType[]>;

// Filtros
export interface INVENTORY_InventoryFilter {
  category?: INVENTORY_CategoryType;
  areaType?: INVENTORY_AreaType;
  searchTerm?: string;
  propertyId?: string;
  roomId?: string;
  status?: INVENTORY_ItemStatus;
  includeSubItems?: boolean;
  templateType?: INVENTORY_TemplateType;
  minValue?: number;
  maxValue?: number;
}

export type INVENTORY_Status = 'ok' | 'attention' | 'problem';

export const INVENTORY_STATUS_COLORS: Record<INVENTORY_Status, string> = {
  ok: '#4caf50',
  attention: '#ff9800',
  problem: '#f44336'
};

export const INVENTORY_STATUS_LABELS: Record<INVENTORY_Status, string> = {
  ok: 'OK',
  attention: 'Needs Attention',
  problem: 'Problem'
};
