import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { PromotionService } from '../../../core/services/promotion.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1 class="mb-4 text-3xl font-bold text-[var(--brand-red)]">Admin Dashboard</h1>
    <div class="mb-4 grid gap-3 sm:grid-cols-3">
      <article class="rounded border bg-white p-4">
        <p class="text-sm text-slate-500">Products</p>
        <p class="text-2xl font-bold">{{ productCount }}</p>
      </article>
      <article class="rounded border bg-white p-4">
        <p class="text-sm text-slate-500">Orders</p>
        <p class="text-2xl font-bold">{{ orderCount }}</p>
      </article>
      <article class="rounded border bg-white p-4">
        <p class="text-sm text-slate-500">Active Promotions</p>
        <p class="text-2xl font-bold">{{ promoCount }}</p>
      </article>
    </div>
    <div class="grid gap-3 sm:grid-cols-3">
      <a routerLink="/admin/products" class="rounded border bg-white p-4">Manage Products</a>
      <a routerLink="/admin/orders" class="rounded border bg-white p-4">Manage Orders</a>
      <a routerLink="/admin/promotions" class="rounded border bg-white p-4">Manage Promotions</a>
    </div>
  `,
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly promotionService = inject(PromotionService);
  productCount = 0;
  orderCount = 0;
  promoCount = 0;

  ngOnInit(): void {
    this.productService.getProducts().subscribe((items) => (this.productCount = items.length));
    this.orderService.getAllOrders().subscribe((items) => (this.orderCount = items.length));
    this.promotionService.getAll().subscribe((items) => (this.promoCount = items.filter((x) => x.isActive).length));
  }
}
