import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../core/models/api.models';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/menu" class="text-sm text-[var(--brand-red)]">← Back to Menu</a>
    <section *ngIf="product" class="mt-3 rounded-xl border bg-white p-5">
      <h1 class="text-3xl font-bold">{{ product.name }}</h1>
      <p class="mt-2 text-slate-600">{{ product.description }}</p>
      <p class="mt-4 text-xl font-bold text-[var(--brand-red)]">Rs {{ product.discountPrice ?? product.basePrice }}</p>
      <button class="mt-4 rounded bg-[var(--brand-yellow)] px-4 py-2 text-white" (click)="add()">Add to Cart</button>
    </section>
  `,
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);
  product: Product | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.productService.getProductById(id).subscribe((p) => (this.product = p));
  }

  add(): void {
    if (!this.product) return;
    this.cartService.addProduct(this.product);
    this.notificationService.show(`${this.product.name} added to cart`);
  }
}
