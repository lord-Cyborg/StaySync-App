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
  address: string;
  propertyId: string;
  gateCode?: string;
  doorCode?: string;
  wifiPassword: string;
  addressNumber: string;
  addressStreet: string;
  status: string;
  images: PropertyImage[];
  createdAt: string;
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
