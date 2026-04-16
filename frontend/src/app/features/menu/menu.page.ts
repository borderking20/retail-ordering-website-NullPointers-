import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/api.models';
import { ProductService } from '../../core/services/product.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h1 class="mb-4 text-3xl font-bold text-[var(--brand-red)]">Menu</h1>
    <div class="mb-4 grid gap-2 rounded-xl border bg-white p-3 md:grid-cols-4">
      <input class="rounded border p-2" placeholder="Search products" [(ngModel)]="filters.search" />
      <input class="rounded border p-2" type="number" placeholder="Min price" [(ngModel)]="filters.minPrice" />
      <input class="rounded border p-2" type="number" placeholder="Max price" [(ngModel)]="filters.maxPrice" />
      <button class="rounded bg-[var(--brand-red)] px-3 py-2 text-white" (click)="applyFilters()">Apply Filters</button>
    </div>
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article class="rounded-xl border bg-white p-4" *ngFor="let item of products">
        <a [routerLink]="['/menu', item.id]" class="font-semibold hover:text-[var(--brand-red)]">{{ item.name }}</a>
        <p class="line-clamp-2 text-sm text-slate-500">{{ item.description || 'Fresh and delicious item.' }}</p>
        <div class="mt-3 flex items-center justify-between">
          <span class="font-bold text-[var(--brand-red)]">Rs {{ item.discountPrice ?? item.basePrice }}</span>
          <button class="rounded bg-[var(--brand-yellow)] px-3 py-1 text-white" (click)="addToCart(item)">Add to Cart</button>
        </div>
      </article>
    </section>
  `,
})
export class MenuPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);
  products: Product[] = [];
  filters: { search: string; minPrice?: number; maxPrice?: number } = { search: '' };

  ngOnInit(): void {
    this.loadProducts();
  }

  applyFilters(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts(this.filters).subscribe({
      next: (items) => {
        this.products = items.length ? items : this.fallbackProducts();
      },
      error: () => {
        this.products = this.fallbackProducts();
      },
    });
  }

  addToCart(product: Product): void {
    this.cartService.addProduct(product);
    this.notificationService.show(`${product.name} added to cart`);
  }

  private fallbackProducts(): Product[] {
    return [
      { id: 'p1', name: 'Margherita Pizza', slug: 'margherita', description: 'Classic cheese pizza', basePrice: 199, stockQty: 20, isVeg: true, packagingType: 'Box' },
      { id: 'p2', name: 'Garlic Bread', slug: 'garlic-bread', description: 'Freshly baked garlic bread', basePrice: 129, stockQty: 25, isVeg: true, packagingType: 'Pack' },
      { id: 'p3', name: 'Cola 500ml', slug: 'cola', description: 'Chilled cold drink', basePrice: 49, stockQty: 50, isVeg: true, packagingType: 'Bottle' },
    ];
  }
}
