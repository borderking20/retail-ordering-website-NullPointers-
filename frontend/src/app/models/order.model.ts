import { Product } from './product.model';

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  productId: string;
  quantity: number;
  itemPrice: number;
  product?: Product;
}

export interface Order {
  orderId: string;
  userId: string;
  totalAmount: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  orderItems: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
