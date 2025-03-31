// Re-export all types from inventory-types
export * from './inventory-types';

// Deprecated interfaces - mantidas temporariamente para compatibilidade
// TODO: Remover após migração completa
import { BaseInventoryItem, InventoryCategoryType } from './inventory-types';

export interface InventoryItem extends BaseInventoryItem {}

export interface InventoryCategory {
  id: string;
  type: InventoryCategoryType;
  name: string;
  items: InventoryItem[];
}
