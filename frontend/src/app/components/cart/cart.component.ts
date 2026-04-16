import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-card" style="max-width: 900px; margin: 2rem auto;">
      <h2 style="font-size: 2.2rem; margin-bottom: 2rem; background: var(--primary-gradient); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Your Digital Cart</h2>
      
      @if (cartItems().length === 0) {
        <div style="text-align: center; padding: 3rem 0;">
          <p style="color: var(--text-muted); font-size: 1.2rem; margin-bottom: 2rem;">Your cart is currently empty in the quantum void.</p>
          <button class="btn-primary" (click)="continueShopping()">Explore Catalog</button>
        </div>
      } @else {
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
          @for (item of cartItems(); track item.product.productId) {
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
              
              <div style="display: flex; align-items: center; gap: 1.5rem;">
                <img *ngIf="item.product.imageUrl" [src]="item.product.imageUrl" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
                <div>
                  <h4 style="font-size: 1.2rem; margin-bottom: 0.2rem;">{{ item.product.productName }}</h4>
                  <p style="color: var(--text-muted);">₹{{ item.product.productPrice }}</p>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 2rem;">
                <input type="number" [ngModel]="item.quantity" (ngModelChange)="updateQuantity(item.product.productId, $event)" min="1" style="width: 80px; text-align: center; font-size: 1.1rem; padding: 0.5rem;">
                <span style="font-weight: 600; font-size: 1.2rem; width: 100px; text-align: right;">₹{{ item.product.productPrice * item.quantity | number:'1.2-2' }}</span>
                <button class="btn-danger" (click)="removeItem(item.product.productId)">Drop</button>
              </div>

            </div>
          }
        </div>
        
        <div style="text-align: right; border-top: 1px solid var(--glass-border); padding-top: 2rem;">
          <h3 style="font-size: 1.8rem; margin-bottom: 1.5rem;">Total Check: <span style="color: var(--accent-color);">₹{{ totalPrice() | number:'1.2-2' }}</span></h3>
          <button class="btn-primary" (click)="checkout()" style="font-size: 1.2rem !important; padding: 1rem 3rem !important;">Initialize Transport Sequence</button>
        </div>
      }
    </div>
  `,
  styles: []
})
export class CartComponent {
  orderService = inject(OrderService);
  authService = inject(AuthService);
  router = inject(Router);

  cartItems = this.orderService.cartItems;
  totalPrice = this.orderService.totalPrice;

  updateQuantity(productId: string, qty: number | string) {
    const productQuantity = typeof qty === 'string' ? parseInt(qty, 10) : qty;
    if (!isNaN(productQuantity)) {
      this.orderService.updateCartItemQuantity(productId, productQuantity);
    }
  }

  removeItem(productId: string) {
    this.orderService.removeFromCart(productId);
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  async checkout() {
    const currentUser = this.authService.currentUser();
    const authToken = this.authService.authToken();
    
    if (!currentUser || !authToken) {
      alert('Please login to checkout.');
      this.router.navigate(['/login']);
      return;
    }

    try {
      await this.orderService.CreateOrderAsync(currentUser.userId);
      alert('Order placed successfully!');
      this.router.navigate(['/orders']);
    } catch (error: any) {
      alert(error.message);
    }
  }
}
