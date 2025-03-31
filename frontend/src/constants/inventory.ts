import { InventoryCategory, ItemStatus, ItemSeverity } from '../types/inventory';
import { logger } from '../utils/logger';

export const ITEMS_BY_CATEGORY = {
  Furniture: {
    kitchen: [
      'Kitchen Table',
      'Kitchen Chairs',
      'Kitchen Cabinet',
      'Bar Stools',
      'Pantry Shelves',
      'Kitchen Island',
      'Storage Cabinet'
    ],
    living: [
      'Sofa',
      'Armchairs',
      'Coffee Table',
      'TV Stand',
      'Side Tables',
      'Console Table',
      'Ottoman',
      'Bookshelf'
    ],
    game: [
      'Pool Table',
      'Gaming Chairs',
      'Game Storage Cabinet',
      'Card Table',
      'Bar Cabinet',
      'Lounge Chairs',
      'Media Console'
    ],
    bedroom: [
      'Bed Frame',
      'Mattress',
      'Nightstands',
      'Dresser',
      'Chest of Drawers',
      'Vanity',
      'Wardrobe'
    ],
    bathroom: [
      'Vanity Cabinet',
      'Mirror Cabinet',
      'Storage Cabinet',
      'Shower Caddy',
      'Towel Rack',
      'Bath Mat',
      'Toilet Paper Holder'
    ]
  },
  Electronics: {
    kitchen: [
      'Refrigerator',
      'Microwave',
      'Dishwasher',
      'Coffee Maker',
      'Toaster',
      'Blender',
      'Electric Kettle'
    ],
    living: [
      'Smart TV',
      'Sound System',
      'Media Player',
      'Remote Controls',
      'Wi-Fi Router',
      'Smart Home Hub'
    ],
    game: [
      'Gaming Console',
      'Game Controllers',
      'Arcade Machine',
      'Sound System',
      'Smart TV'
    ],
    bedroom: [
      'Smart TV',
      'Remote Control',
      'Alarm Clock',
      'Fan',
      'Phone Charger'
    ],
    bathroom: [
      'Hair Dryer',
      'Electric Toothbrush Charger',
      'Scale',
      'Heated Towel Rack',
      'Exhaust Fan'
    ]
  },
  'Floor/Carpet': {
    kitchen: [
      'Anti-Fatigue Mat',
      'Runner Rug',
      'Area Rug'
    ],
    living: [
      'Area Rug',
      'Runner Rug',
      'Door Mat',
      'Carpet Padding'
    ],
    game: [
      'Area Rug',
      'Anti-Fatigue Mat',
      'Door Mat'
    ],
    bedroom: [
      'Area Rug',
      'Runner Rug',
      'Door Mat'
    ],
    bathroom: [
      'Bath Mat',
      'Anti-Slip Mat',
      'Runner Rug'
    ]
  },
  Wall: {
    kitchen: [
      'Clock',
      'Artwork',
      'Backsplash'
    ],
    living: [
      'Artwork',
      'Mirror',
      'Wall Clock',
      'Wall Shelves'
    ],
    game: [
      'Game-themed Art',
      'Wall-mounted TV',
      'Decorative Signs'
    ],
    bedroom: [
      'Artwork',
      'Mirror',
      'Wall Clock',
      'Wall Shelves'
    ],
    bathroom: [
      'Mirror',
      'Wall Art',
      'Towel Hooks'
    ]
  },
  'Bed Linen': [
    'Sheets',
    'Pillowcases',
    'Duvet Cover',
    'Comforter',
    'Blanket',
    'Throw Pillows',
    'Mattress Protector',
    'Pillow Protectors'
  ],
  Towel: [
    'Bath Towels',
    'Hand Towels',
    'Washcloths',
    'Beach Towels',
    'Kitchen Towels',
    'Bath Mat'
  ]
};

export const STATUS_COLORS: Record<ItemStatus, string> = {
  ok: '#4CAF50',      // Verde
  attention: '#FFC107', // Laranja
  problem: '#F44336'    // Vermelho
} as const;

export const STATUS_LABELS: Record<ItemStatus, string> = {
  ok: 'OK',
  attention: 'Attention',
  problem: 'Problem'
} as const;

export const SEVERITY_LABELS: Record<ItemSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
} as const;

export const SEVERITY_COLORS: Record<ItemSeverity, string> = {
  low: '#FFB74D',    // Laranja claro
  medium: '#FF9800', // Laranja
  high: '#F57C00'    // Laranja escuro
} as const;

export const STATUS_LEVELS = ['ok', 'attention', 'problem'] as const;

// Sistema de especificações
export interface Specification {
  id: string;
  name: string;
  value: string;
  unit: string;
  type: SpecificationType;
}

export type SpecificationType = 
  | 'dimension'  // Para medidas (altura, largura, etc)
  | 'weight'     // Para peso
  | 'material'   // Para materiais
  | 'color'      // Para cores
  | 'model'      // Para modelos/números de série
  | 'other';     // Para outros tipos

export const UNITS = {
  dimension: ['in', 'cm', 'm'],
  weight: ['kg', 'lb'],
  volume: ['l', 'ml'],
  none: ['']
} as const;

export const MOCK_CATEGORIES: InventoryCategory[] = [
  {
    id: '1',
    name: 'Furniture',
    items: [
      {
        id: '1-1',
        name: 'Queen Bed',
        status: 'ok',
        quantity: 1,
        notes: 'Good condition'
      },
      {
        id: '1-2',
        name: 'Nightstand',
        status: 'ok',
        quantity: 2,
        notes: 'Minor scratches on surface'
      }
    ]
  },
  {
    id: '2',
    name: 'Electronics',
    items: [
      {
        id: '2-1',
        name: '55" Smart TV',
        status: 'ok',
        quantity: 1,
        notes: 'Samsung Model 2023'
      },
      {
        id: '2-2',
        name: 'Air Conditioner',
        status: 'problem',
        quantity: 1,
        notes: 'Needs maintenance'
      }
    ]
  },
  {
    id: '3',
    name: 'Floor/Carpet',
    items: [
      {
        id: '3-1',
        name: 'Area Rug',
        status: 'ok',
        quantity: 1,
        notes: 'Recently cleaned'
      },
      {
        id: '3-2',
        name: 'Door Mat',
        status: 'ok',
        quantity: 1,
        notes: 'Good condition'
      }
    ]
  },
  {
    id: '4',
    name: 'Wall',
    items: [
      {
        id: '4-1',
        name: 'Artwork',
        status: 'ok',
        quantity: 2,
        notes: 'Abstract prints'
      },
      {
        id: '4-2',
        name: 'Mirror',
        status: 'ok',
        quantity: 1,
        notes: 'Full length'
      }
    ]
  }
];

// Log das constantes carregadas
logger.info('inventory.ts', 'Inventory constants loaded', {
  statusColors: Object.keys(STATUS_COLORS),
  specificationTypes: ['dimension', 'weight', 'material', 'color', 'model', 'other'],
  units: Object.keys(UNITS)
});
