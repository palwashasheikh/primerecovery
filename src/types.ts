export interface ProductOption {
  name: string;
  position: number;
  values: string[];
}

export interface ProductVariant {
  id: number;
  title: string;
  price: string;
  sku: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  variants?: ProductVariant[];
  options?: ProductOption[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'completed';
  createdAt: string;
}
