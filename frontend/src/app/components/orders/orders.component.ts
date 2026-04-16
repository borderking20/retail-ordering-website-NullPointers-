import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink],
  template: `
    <div class="page-header">
      <h2>My Orders</h2>
      <p>Track your order history and status</p>
    </div>

    @if (!user()) {
      <div class="card empty-state">
        <div class="empty-icon">🔐</div>
        <h3>Login required</h3>
        <p style="margin-bottom:1.5rem;">Please log in to view your order history</p>
        <a routerLink="/login" class="btn-primary" style="text-decoration:none; display:inline-block;">Login Now</a>
      </div>
    } @else if (isLoading()) {
      <div class="card empty-state">
        <div class="empty-icon">⏳</div>
        <h3>Loading orders...</h3>
      </div>
    } @else if (orders().length === 0) {
      <div class="card empty-state">
        <div class="empty-icon">📋</div>
        <h3>No orders yet</h3>
        <p style="margin-bottom:1.5rem;">Your order history will appear here</p>
        <a routerLink="/products" class="btn-primary" style="text-decoration:none; display:inline-block;">Start Shopping</a>
      </div>
    } @else {
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        @for (order of orders(); track order.orderId) {
          <div class="card" style="padding:0; overflow:hidden;">

            <!-- Order Header -->
            <div style="display:flex; align-items:center; justify-content:space-between; padding:1rem 1.5rem; background:var(--surface-2); border-bottom:1px solid var(--border-light);">
              <div>
                <div style="font-size:0.8rem; color:var(--text-muted); font-weight:500; margin-bottom:0.2rem;">ORDER ID</div>
                <div style="font-weight:700; color:var(--text-main); font-size:0.95rem;">#{{ order.orderId }}</div>
              </div>
              <div>
                <div style="font-size:0.8rem; color:var(--text-muted); font-weight:500; margin-bottom:0.2rem;">DATE</div>
                <div style="font-weight:600; color:var(--text-main); font-size:0.9rem;">{{ order.createdAt | date:'dd MMM yyyy, hh:mm a' }}</div>
              </div>
              <div>
                <span [class]="'badge badge-status-' + order.orderStatus?.toLowerCase()">
                  {{ order.orderStatus }}
                </span>
              </div>
              <div style="text-align:right;">
                <div style="font-size:0.8rem; color:var(--text-muted); font-weight:500; margin-bottom:0.2rem;">TOTAL</div>
                <div style="font-weight:800; color:var(--primary); font-size:1.1rem;">₹{{ order.totalAmount | number:'1.2-2' }}</div>
              </div>
            </div>

            <!-- Order Items -->
            <div style="padding:1rem 1.5rem;">
              <div style="font-weight:600; font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.75rem;">Items Ordered</div>
              @for (item of order.orderItems; track item.orderItemId) {
                <div style="display:flex; align-items:center; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid var(--border-light);">
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <span>{{ emoji(item.product?.productCategory ?? '') }}</span>
                    <span style="font-weight:500; color:var(--text-main);">{{ item.product?.productName ?? 'Product #' + item.productId }}</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:2rem; color:var(--text-muted); font-size:0.9rem;">
                    <span>Qty: <strong style="color:var(--text-main);">{{ item.quantity }}</strong></span>
                    <span>₹{{ item.itemPrice | number:'1.2-2' }} each</span>
                    <span style="font-weight:700; color:var(--primary);">₹{{ item.quantity * item.itemPrice | number:'1.2-2' }}</span>
                  </div>
                </div>
              }
            </div>

          </div>
        }
      </div>
    }
  `
})
export class OrdersComponent implements OnInit {
  orderService = inject(OrderService);
  authService = inject(AuthService);

  orders = signal<Order[]>([]);
  isLoading = signal(false);
  user = this.authService.currentUser;

  emoji(cat: string) {
    const map: Record<string,string> = { 'Pizza':'🍕','Cold Drinks':'🥤','Breads':'🍞','Burgers':'🍔','Desserts':'🍰' };
    return map[cat] ?? '🛒';
  }

  async ngOnInit() {
    const currentUserValue = this.user();
    if (currentUserValue) {
      this.isLoading.set(true);
      try {
        const userOrders = await this.orderService.GetUserOrdersAsync(currentUserValue.userId);
        this.orders.set(userOrders);
      } catch (e) { /* not logged in yet */ }
      this.isLoading.set(false);
    }
  }
}
