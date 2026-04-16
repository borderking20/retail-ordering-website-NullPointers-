import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h2>Shopping Cart</h2>
      <p>Review your items before placing the order</p>
    </div>

    @if (cartItems().length === 0) {
      <div class="card empty-state">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="margin-bottom:1.5rem;">Add some products to get started</p>
        <a routerLink="/products" class="btn-primary" style="text-decoration:none; display:inline-block;">
          Browse Products
        </a>
      </div>
    } @else {
      <div style="display:grid; grid-template-columns: 1fr 340px; gap:1.5rem; align-items:start;">

        <!-- Cart Items -->
        <div class="card" style="padding:0; overflow:hidden;">
          <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-light); font-weight:700; color:var(--text-main);">
            {{ cartItems().length }} Item(s)
          </div>
          @for (item of cartItems(); track item.product.productId) {
            <div style="display:flex; align-items:center; gap:1.25rem; padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-light);">
              <div style="font-size:2.5rem; width:56px; text-align:center;">
                {{ emoji(item.product.productCategory) }}
              </div>
              <div style="flex:1;">
                <div style="font-weight:600; color:var(--text-main); margin-bottom:0.2rem;">{{ item.product.productName }}</div>
                <div style="color:var(--text-muted); font-size:0.875rem;">₹{{ item.product.productPrice }} each</div>
              </div>

              <div style="display:flex; align-items:center; gap:0.5rem;">
                <button (click)="decrement(item.product.productId, item.quantity)"
                  style="width:30px; height:30px; border:1.5px solid var(--border); background:white; border-radius:6px; cursor:pointer; font-size:1rem; display:flex; align-items:center; justify-content:center;">−</button>
                <span style="width:30px; text-align:center; font-weight:700;">{{ item.quantity }}</span>
                <button (click)="increment(item.product.productId, item.quantity)"
                  style="width:30px; height:30px; border:1.5px solid var(--border); background:white; border-radius:6px; cursor:pointer; font-size:1rem; display:flex; align-items:center; justify-content:center;">+</button>
              </div>

              <div style="font-weight:700; color:var(--primary); min-width:80px; text-align:right;">
                ₹{{ item.product.productPrice * item.quantity | number:'1.2-2' }}
              </div>

              <button class="btn-danger" (click)="remove(item.product.productId)">Remove</button>
            </div>
          }
        </div>

        <!-- Order Summary -->
        <div class="card">
          <h3 style="font-size:1.1rem; margin-bottom:1.25rem; color:var(--text-main);">Order Summary</h3>

          <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; font-size:0.95rem; color:var(--text-muted);">
            <span>Subtotal</span><span>₹{{ totalPrice() | number:'1.2-2' }}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; font-size:0.95rem; color:var(--text-muted);">
            <span>Delivery</span><span style="color:var(--success);">Free</span>
          </div>
          <hr class="divider">
          <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:800; color:var(--text-main); margin-bottom:1.5rem;">
            <span>Total</span><span style="color:var(--primary);">₹{{ totalPrice() | number:'1.2-2' }}</span>
          </div>

          @if (errorMessage()) {
            <div class="auth-card error-msg" style="margin-bottom:1rem;">{{ errorMessage() }}</div>
          }

          <button class="btn-primary" (click)="checkout()" [disabled]="isLoading()" style="width:100%; padding:0.8rem !important; font-size:1rem !important;">
            {{ isLoading() ? 'Placing Order...' : 'Place Order' }}
          </button>

          <div class="alert-info" style="margin-top:1rem; font-size:0.8rem;">
            🔒 Secure checkout — you must be logged in to place an order.
          </div>
        </div>

      </div>
    }
  `
})
export class CartComponent {
  orderService = inject(OrderService);
  authService = inject(AuthService);
  router = inject(Router);

  cartItems = this.orderService.cartItems;
  totalPrice = this.orderService.totalPrice;
  isLoading = signal(false);
  errorMessage = signal('');

  emoji(cat: string) {
    const map: Record<string,string> = { 'Pizza':'🍕','Cold Drinks':'🥤','Breads':'🍞','Burgers':'🍔','Desserts':'🍰' };
    return map[cat] ?? '🛒';
  }

  increment(productId: string, current: number) { this.orderService.updateCartItemQuantity(productId, current + 1); }
  decrement(productId: string, current: number) { this.orderService.updateCartItemQuantity(productId, current - 1); }
  remove(productId: string) { this.orderService.removeFromCart(productId); }

  async checkout() {
    if (!this.authService.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      await this.orderService.CreateOrderAsync();
      this.router.navigate(['/orders']);
    } catch (e: any) {
      this.errorMessage.set(e.message ?? 'Order failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
