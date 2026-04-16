import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly cartItems = signal<CartItem[]>([]);

  readonly totalPrice = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.product.productPrice * item.quantity), 0);
  });

  addToCart(product: any, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.product.productId === product.productId);

    if (existingItem) {
      this.cartItems.update(items => items.map(item => 
        item.product.productId === product.productId ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      this.cartItems.update(items => [...items, { product, quantity }]);
    }
  }

  updateCartItemQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items => items.map(item => 
      item.product.productId === productId ? { ...item, quantity } : item
    ));
  }

  removeFromCart(productId: string): void {
    this.cartItems.update(items => items.filter(item => item.product.productId !== productId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
