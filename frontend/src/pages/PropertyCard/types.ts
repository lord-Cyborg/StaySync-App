export interface Room {
  name: string;
}

export interface Property {
  id: string;
  name: string;
  type: string;
  mainImage: string;
  bedroomCount: number;
  bathroomCount: number;
  kitchens: Room[];
  livingRooms: Room[];
  gameRooms: Room[];
  pools: Room[];
  bbq: Room[];
  ownerCloset: Room[];
  acRoom: Room[];
}

export interface AreaImage {
  id: number;
  image: string;
  label: number;
  hasCode?: boolean;
}

export interface Area {
  id: string;
  label: string;
  icon: JSX.Element;
  count: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  status: 'ok' | 'attention' | 'problem';
  quantity?: number;
  notes?: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  items: InventoryItem[];
}
