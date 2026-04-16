import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
import { OrderService, OrderSummary } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1 class="mb-4 text-3xl font-bold text-[var(--brand-red)]">Admin Orders</h1>
    <div class="space-y-2">
      <article class="rounded-xl border bg-white p-4" *ngFor="let order of orders">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="font-medium">{{ order.id }}</p>
            <p class="text-sm text-slate-500">Rs {{ order.grandTotal }} | {{ order.paymentMethod }}</p>
          </div>
          <div class="flex items-center gap-2">
            <select class="rounded border p-1" [(ngModel)]="order.orderStatus">
              <option>Pending</option><option>Confirmed</option><option>Preparing</option>
              <option>OutForDelivery</option><option>Delivered</option><option>Cancelled</option>
            </select>
            <button class="rounded bg-[var(--brand-red)] px-3 py-1 text-white" (click)="save(order)">Update</button>
          </div>
        </div>
      </article>
    </div>
  `,
})
export class AdminOrdersPageComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly notificationService = inject(NotificationService);
  orders: OrderSummary[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.orderService.getAllOrders().subscribe((items) => (this.orders = items));
  }

  save(order: OrderSummary): void {
    this.orderService.updateStatus(order.id, order.orderStatus).subscribe(() => {
      this.notificationService.show('Order status updated');
    });
  }
}
