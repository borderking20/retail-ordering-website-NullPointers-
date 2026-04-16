import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Order, CartItem, OrderItem } from '../models/order.model';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private apiUrl = 'http://localhost:5105/api/order';
  
  private readonly userOrdersSignal = signal<Order[]>([]);

  // Proxy cart signals for backward compatibility if needed, or update components
  get cartItems() { return this.cartService.cartItems; }
  get totalPrice() { return this.cartService.totalPrice; }

  addToCart(selectedProduct: Product, productQuantity: number = 1): void {
    this.cartService.addToCart(selectedProduct, productQuantity);
  }

  updateCartItemQuantity(productId: string, productQuantity: number): void {
    this.cartService.updateCartItemQuantity(productId, productQuantity);
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  async CreateOrderAsync(): Promise<Order> {
    const items = this.cartItems();
    const currentUser = this.authService.currentUser();
    
    if (items.length === 0) throw new Error('Cart is empty');
    if (!currentUser) throw new Error('User not authenticated');

    // camelCase payload — backend JSON policy is now camelCase + case-insensitive
    const orderPayload = {
      userId: parseInt(currentUser.userId),
      totalAmount: this.totalPrice(),
      orderItems: items.map(i => ({
        productId: parseInt(i.product.productId),
        quantity: i.quantity,
        itemPrice: i.product.productPrice
      }))
    };

    const headers = { 'Authorization': `Bearer ${this.authService.authToken()}` };
    const newOrder = await firstValueFrom(this.http.post<Order>(this.apiUrl, orderPayload, { headers }));
    
    this.userOrdersSignal.update(orders => [newOrder, ...orders]);
    this.clearCart();
    return newOrder;
  }

  async GetUserOrdersAsync(userId: string): Promise<Order[]> {
    const headers = { 'Authorization': `Bearer ${this.authService.authToken()}` };
    const orders = await firstValueFrom(this.http.get<Order[]>(`${this.apiUrl}/user`, { headers }));
    this.userOrdersSignal.set(orders);
    return orders;
  }
}
