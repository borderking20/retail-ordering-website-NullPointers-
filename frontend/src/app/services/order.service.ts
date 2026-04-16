import { Injectable, signal, computed, inject } from '@angular/core';
import { Order, CartItem, OrderItem } from '../models/order.model';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private productService = inject(ProductService);
  
  readonly cartItems = signal<CartItem[]>([]);
  private readonly userOrdersSignal = signal<Order[]>([]);

  readonly totalPrice = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.product.productPrice * item.quantity), 0);
  });

  addToCart(selectedProduct: Product, productQuantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.product.productId === selectedProduct.productId);

    if (existingItem) {
      this.cartItems.update(items => items.map(item => 
        item.product.productId === selectedProduct.productId ? { ...item, quantity: item.quantity + productQuantity } : item
      ));
    } else {
      this.cartItems.update(items => [...items, { product: selectedProduct, quantity: productQuantity }]);
    }
  }

  updateCartItemQuantity(productId: string, productQuantity: number): void {
    if (productQuantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items => items.map(item => 
      item.product.productId === productId ? { ...item, quantity: productQuantity } : item
    ));
  }

  removeFromCart(productId: string): void {
    this.cartItems.update(items => items.filter(item => item.product.productId !== productId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  async CreateOrderAsync(userId: string): Promise<Order> {
    const items = this.cartItems();
    if (items.length === 0) {
      throw new Error('Cart is empty');
    }

    const orderId = `ord_${Date.now()}`;
    const orderItems: OrderItem[] = items.map((i, index) => ({
      orderItemId: `${orderId}_item_${index}`,
      orderId: orderId,
      productId: i.product.productId,
      quantity: i.quantity,
      itemPrice: i.product.productPrice,
      product: i.product
    }));

    const amount = this.totalPrice();

    const newOrder: Order = {
      orderId,
      userId,
      items: orderItems,
      totalAmount: amount,
      orderStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    for (const item of items) {
      await this.productService.ReduceProductStock(item.product.productId, item.quantity);
    }

    this.userOrdersSignal.update(orders => [...orders, newOrder]);
    this.clearCart();
    
    return newOrder;
  }

  async GetUserOrdersAsync(userId: string): Promise<Order[]> {
    return this.userOrdersSignal().filter(o => o.userId === userId);
  }
}
