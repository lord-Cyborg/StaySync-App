import { InventoryCategoryType, AreaType, CategoryGroups } from '../types/inventory-types';

export const categoryGroups: CategoryGroups = {
  bedroom: ['Furniture', 'Bed Linen', 'Electronics', 'Lighting', 'Floor-Carpet', 'Wall'],
  bathroom: ['Furniture', 'Lighting', 'Wall', 'Towels'],
  kitchen: ['Furniture', 'Electronics', 'Lighting', 'Wall'],
  living: ['Furniture', 'Electronics', 'Lighting', 'Floor-Carpet', 'Wall'],
  game: ['Furniture', 'Electronics', 'Lighting', 'Floor-Carpet', 'Wall'],
  all: ['Furniture', 'Bed Linen', 'Electronics', 'Lighting', 'Floor-Carpet', 'Wall', 'Towels', 'Bathroom', 'Kitchen']
} as const;

export const initialInventory = {
  bedroom: [
    {
      id: 'bed-1',
      category: 'Furniture' as InventoryCategoryType,
      name: 'Queen Size Bed',
      status: 'attention',
      severity: 'medium',
      quantity: 1,
      condition: 3,
      notes: 'Scratches on headboard, needs repair',
      isChecked: false
    },
    {
      id: 'nightstand-1',
      category: 'Furniture' as InventoryCategoryType,
      name: 'Nightstand',
      status: 'ok',
      quantity: 2,
      condition: 4,
      isChecked: false
    },
    {
      id: 'dresser-1',
      category: 'Furniture' as InventoryCategoryType,
      name: 'Dresser',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'sheets-1',
      category: 'Bed Linen' as InventoryCategoryType,
      name: 'Bed Sheet Set',
      status: 'problem',
      severity: 'high',
      quantity: 2,
      condition: 2,
      notes: 'Permanent stains',
      isChecked: false
    },
    {
      id: 'duvet-1',
      category: 'Bed Linen' as InventoryCategoryType,
      name: 'Duvet Cover',
      status: 'ok',
      quantity: 1,
      condition: 4,
      isChecked: false
    },
    {
      id: 'pillows-1',
      category: 'Bed Linen' as InventoryCategoryType,
      name: 'Pillows',
      status: 'attention',
      severity: 'low',
      quantity: 4,
      condition: 3,
      notes: 'Some need replacement',
      isChecked: false
    },
    {
      id: 'tv-bedroom',
      category: 'Electronics' as InventoryCategoryType,
      name: '43" Smart TV',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'ceiling-light-1',
      category: 'Lighting' as InventoryCategoryType,
      name: 'Ceiling Light',
      status: 'problem',
      severity: 'medium',
      quantity: 1,
      condition: 2,
      notes: 'Light flickering intermittently',
      isChecked: false
    },
    {
      id: 'wall-1',
      category: 'Wall' as InventoryCategoryType,
      name: 'North Wall',
      status: 'attention',
      severity: 'medium',
      quantity: 1,
      condition: 3,
      notes: 'Small cracks near window',
      isChecked: false
    }
  ],
  bathroom: [
    {
      id: 'vanity-1',
      category: 'Furniture' as InventoryCategoryType,
      name: 'Vanity Cabinet',
      status: 'ok',
      quantity: 1,
      condition: 4,
      isChecked: false
    },
    {
      id: 'ceiling-light-bathroom',
      category: 'Lighting' as InventoryCategoryType,
      name: 'Ceiling Light',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'wall-bathroom',
      category: 'Wall' as InventoryCategoryType,
      name: 'North Wall',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'towels-1',
      category: 'Towels' as InventoryCategoryType,
      name: 'Bath Towels',
      status: 'attention',
      severity: 'low',
      quantity: 4,
      condition: 3,
      notes: 'Some fraying at edges',
      isChecked: false
    }
  ],
  living: [
    {
      id: 'sofa-1',
      category: 'Furniture' as InventoryCategoryType,
      name: '3-Seater Sofa',
      status: 'ok',
      quantity: 1,
      condition: 4,
      isChecked: false
    },
    {
      id: 'tv-living',
      category: 'Electronics' as InventoryCategoryType,
      name: '55" Smart TV',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'ceiling-light-living',
      category: 'Lighting' as InventoryCategoryType,
      name: 'Ceiling Light',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'carpet-living',
      category: 'Floor-Carpet' as InventoryCategoryType,
      name: 'Carpet',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'wall-living',
      category: 'Wall' as InventoryCategoryType,
      name: 'North Wall',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    }
  ],
  kitchen: [
    {
      id: 'table-1',
      category: 'Furniture' as InventoryCategoryType,
      name: 'Dining Table',
      status: 'ok',
      quantity: 1,
      condition: 4,
      isChecked: false
    },
    {
      id: 'microwave-1',
      category: 'Electronics' as InventoryCategoryType,
      name: 'Microwave Oven',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'ceiling-light-kitchen',
      category: 'Lighting' as InventoryCategoryType,
      name: 'Ceiling Light',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'wall-kitchen',
      category: 'Wall' as InventoryCategoryType,
      name: 'North Wall',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    }
  ],
  game: [
    {
      id: 'pool-table-1',
      category: 'Furniture' as InventoryCategoryType,
      name: 'Pool Table',
      status: 'ok',
      quantity: 1,
      condition: 4,
      isChecked: false
    },
    {
      id: 'game-console-1',
      category: 'Electronics' as InventoryCategoryType,
      name: 'Gaming Console',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'ceiling-light-game',
      category: 'Lighting' as InventoryCategoryType,
      name: 'Ceiling Light',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'carpet-game',
      category: 'Floor-Carpet' as InventoryCategoryType,
      name: 'Carpet',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    },
    {
      id: 'wall-game',
      category: 'Wall' as InventoryCategoryType,
      name: 'North Wall',
      status: 'ok',
      quantity: 1,
      condition: 5,
      isChecked: false
    }
  ]
};
