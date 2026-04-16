import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product.model';

const CATEGORY_EMOJI: Record<string, string> = {
  'Pizza': '🍕',
  'Cold Drinks': '🥤',
  'Breads': '🍞',
  'Burgers': '🍔',
  'Desserts': '🍰',
};

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Banner -->
    <div class="hero">
      <h1>Fresh Pizzas, Breads &amp; Cold Drinks</h1>
      <p>Order your favourites from our curated menu and get them delivered seamlessly.</p>
      <a routerLink="/cart" class="hero-btn">View Cart</a>
    </div>

    <!-- Categories Filter -->
    <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; flex-wrap:wrap;">
      <button
        *ngFor="let cat of categories"
        (click)="selectedCategory.set(cat)"
        [style.background]="selectedCategory() === cat ? 'var(--primary-gradient)' : 'white'"
        [style.color]="selectedCategory() === cat ? 'white' : 'var(--text-muted)'"
        [style.border]="selectedCategory() === cat ? 'none' : '1.5px solid var(--border)'"
        style="padding:0.45rem 1rem; border-radius:50px; font-weight:600; font-size:0.85rem; cursor:pointer; transition:all 0.2s;">
        {{ cat }}
      </button>
    </div>

    <!-- Loading / Empty -->
    @if (isLoading()) {
      <div class="empty-state">
        <div class="empty-icon">⏳</div>
        <h3>Loading products...</h3>
        <p>Fetching from the server</p>
      </div>
    } @else if (filteredProducts().length === 0) {
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No products found</h3>
        <p>Try a different category</p>
      </div>
    } @else {
      <!-- Section Title -->
      <div class="section-title">
        <div class="title-bar"></div>
        {{ selectedCategory() }} ({{ filteredProducts().length }} items)
      </div>

      <!-- Product Grid -->
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:1.5rem;">
        @for (product of filteredProducts(); track product.productId) {
          <div class="product-card">
            <!-- Image / Emoji -->
            <div class="product-card-img">
              {{ emoji(product.productCategory) }}
            </div>

            <!-- Body -->
            <div class="product-card-body">
              <span class="badge badge-category">{{ product.productCategory }}</span>
              <h3 style="font-size:1.1rem; color:var(--text-main); margin-top:0.25rem;">{{ product.productName }}</h3>
              <p style="color:var(--text-muted); font-size:0.875rem;">
                {{ product.productStock > 0 ? product.productStock + ' in stock' : 'Out of stock' }}
              </p>
            </div>

            <!-- Footer -->
            <div class="product-card-footer">
              <span style="font-size:1.3rem; font-weight:800; color:var(--primary);">
                ₹{{ product.productPrice }}
              </span>
              <button
                class="btn-primary"
                [disabled]="product.productStock === 0"
                (click)="addToCart(product)"
                style="padding:0.5rem 1rem !important; font-size:0.875rem !important;">
                {{ product.productStock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        }
      </div>
    }

    <!-- Toast -->
    @if (toastMessage()) {
      <div style="position:fixed; bottom:1.5rem; right:1.5rem; background:var(--success); color:white; padding:0.75rem 1.25rem; border-radius:var(--radius-md); box-shadow:var(--shadow-lg); font-weight:600; z-index:9999; animation: slideIn 0.3s ease;">
        ✅ {{ toastMessage() }}
      </div>
    }
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
  `]
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);
  orderService = inject(OrderService);

  readonly productList = signal<Product[]>([]);
  readonly selectedCategory = signal<string>('All');
  readonly isLoading = signal(true);
  readonly toastMessage = signal('');

  categories = ['All', 'Pizza', 'Burgers', 'Breads', 'Cold Drinks', 'Desserts'];

  readonly filteredProducts = () => {
    const all = this.productList();
    const cat = this.selectedCategory();
    return cat === 'All' ? all : all.filter(p => p.productCategory === cat);
  };

  emoji(cat: string) { return CATEGORY_EMOJI[cat] ?? '🛒'; }

  async ngOnInit() {
    this.isLoading.set(true);
    const list = await this.productService.GetAllProductsAsync();
    this.productList.set(list);
    this.isLoading.set(false);
  }

  addToCart(product: Product) {
    this.orderService.addToCart(product, 1);
    this.toastMessage.set(product.productName + ' added to cart');
    setTimeout(() => this.toastMessage.set(''), 2500);
  }
}
