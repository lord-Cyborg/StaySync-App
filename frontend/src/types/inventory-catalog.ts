// Status e Severity
export type ItemStatus = 'ok' | 'attention' | 'problem';

export type ItemSeverity = 'low' | 'medium' | 'high';

// Inventory Categories
export type InventoryCategory = 
  | 'Furniture'
  | 'Electronics'
  | 'Bed Linen'
  | 'Lights'
  | 'Floor-Carpet'
  | 'Wall'
  | 'Bathroom'
  | 'Kitchen';

export type AreaType = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'game' | 'all';

export type Severity = 'low' | 'medium' | 'high';

export interface Specification {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  type: 'dimension' | 'material' | 'other';
}

export interface Dimension {
  length?: number;
  width?: number;
  height?: number;
  unit: 'in' | 'ft' | 'cm' | 'm';
}

// Template item in the global catalog
export interface CatalogItem {
  id: string;
  name: string;
  category: InventoryCategory;
  type: string;
  groups: string[];
  description?: string;
  specifications: Specification[];
  defaultValue: number;
  manufacturer?: string;
  propertyIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Instance of a catalog item in a specific property
export interface PropertyInventoryItem {
  id: string;
  catalogItemId: string;
  propertyId: string;
  roomId: string;
  areaType: string;
  name: string;
  category: InventoryCategory;
  type: string;
  groups?: string[];
  status: ItemStatus;
  severity?: ItemSeverity;
  quantity: number;
  currentValue?: number;
  notes?: string;
  description?: string;
  specifications: Specification[];
  manufacturer?: string;
  isChecked?: boolean;
  customizations?: {
    color?: string;
    additions?: string[];
    [key: string]: any;
  };
  parentId?: string;
  photos?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InventoryFilter {
  category?: InventoryCategory;
  areaType?: AreaType;
  searchTerm?: string;
  propertyId?: string;
  roomId?: string;
  status?: ItemStatus;
  minValue?: number;
  maxValue?: number;
}
