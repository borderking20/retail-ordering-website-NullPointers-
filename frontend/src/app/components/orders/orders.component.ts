import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe, DatePipe, DecimalPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe, DatePipe, DecimalPipe, RouterLink],
  template: `
    <div style="max-width: 900px; margin: 2rem auto;">
      <div class="glass-card" style="margin-bottom: 2rem; text-align: center;">
        <h2 style="font-size: 2.2rem; background: var(--primary-gradient); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Order Archives</h2>
      </div>
      
      @if (!user) {
        <div class="glass-card" style="text-align: center;">
          <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1.5rem;">Access requires verification.</p>
          <a routerLink="/login" class="btn-primary" style="text-decoration: none; padding: 0.8rem 2rem; display: inline-block;">Authenticate Now</a>
        </div>
      } @else if (isLoading()) {
        <div class="glass-card" style="text-align: center; color: var(--text-muted);">Decrypting history...</div>
      } @else if (orders().length === 0) {
        <div class="glass-card" style="text-align: center; color: var(--text-muted);">No recorded cycles found.</div>
      } @else {
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          @for (order of orders(); track order.orderId) {
            <div class="glass-card" style="padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                <h3 style="font-size: 1.2rem; color: var(--text-muted); font-weight: 500;">Hash: <span style="color: var(--text-main);">{{ order.orderId }}</span></h3>
                <span [class]="'badge ' + order.orderStatus" style="padding: 0.4rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; background: rgba(255,255,255,0.1);">
                  {{ order.orderStatus }}
                </span>
              </div>
              
              <div style="margin-bottom: 1rem;">
                @for (item of order.items; track item.orderItemId) {
                  <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                    <span style="color: var(--text-muted);">{{ item.quantity }}x <span style="color: var(--text-main); font-weight: 500;">{{ item.product?.productName || item.productId }}</span></span>
                    <span style="font-weight: 600;">₹{{ item.quantity * item.itemPrice | number:'1.2-2' }}</span>
                  </div>
                }
              </div>
              
              <div style="text-align: right; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; font-size: 1.2rem;">
                Total Transfer: <strong style="color: var(--accent-color);">₹{{ order.totalAmount | number:'1.2-2' }}</strong>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class OrdersComponent implements OnInit {
  orderService = inject(OrderService);
  authService = inject(AuthService);
  
  orders = signal<Order[]>([]);
  isLoading = signal(false);
  user = this.authService.currentUser();

  async ngOnInit() {
    if (this.user) {
      this.isLoading.set(true);
      const userOrders = await this.orderService.GetUserOrdersAsync(this.user.userId);
      this.orders.set(userOrders);
      this.isLoading.set(false);
    }
  }
}
