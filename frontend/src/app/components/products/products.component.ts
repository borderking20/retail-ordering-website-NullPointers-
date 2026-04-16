import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="products-header" style="margin-bottom: 2rem; text-align: center;">
      <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Quantum Catalog</h2>
      <p style="color: var(--text-muted); font-size: 1.1rem;">Experience fresh ingredients at light speed.</p>
    </div>
    
    <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
      @for (selectedProduct of productList(); track selectedProduct.productId) {
        <div class="glass-card" style="display: flex; flex-direction: column;">
          <div style="height: 200px; display:flex; align-items:center; justify-content:center; overflow:hidden; border-radius: 8px; margin-bottom: 1.5rem; background: rgba(0,0,0,0.3);">
             <img *ngIf="selectedProduct.imageUrl" [src]="selectedProduct.imageUrl" [alt]="selectedProduct.productName" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          </div>
          <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">{{ selectedProduct.productName }}</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; flex-grow: 1;">{{ selectedProduct.description }}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 1rem;">
            <span style="font-weight: 700; font-size: 1.4rem; color: var(--success);">₹{{ selectedProduct.productPrice }}</span>
            <button class="btn-primary" (click)="addToCart(selectedProduct)">Add to Cart</button>
          </div>
        </div>
      } @empty {
        <div class="glass-card" style="grid-column: 1 / -1; text-align: center;">
          <p>No products available right now.</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);
  orderService = inject(OrderService);

  readonly productList = signal<Product[]>([]);

  async ngOnInit() {
    const list = await this.productService.GetAllProductsAsync();
    this.productList.set(list);
  }

  addToCart(selectedProduct: Product) {
    const defaultProductQuantity = 1;
    this.orderService.addToCart(selectedProduct, defaultProductQuantity);
    alert(`${selectedProduct.productName} added to cart!`);
  }
}
