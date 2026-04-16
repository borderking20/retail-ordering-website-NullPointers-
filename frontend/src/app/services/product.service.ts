import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5105/api/product';
  
  readonly productList = signal<Product[]>([]);
  readonly selectedProduct = signal<Product | null>(null);
  readonly productQuantity = signal<number>(1);

  async GetAllProductsAsync(): Promise<Product[]> {
    try {
      const products = await firstValueFrom(this.http.get<Product[]>(this.apiUrl));
      this.productList.set(products);
      return products;
    } catch (error) {
      console.error('Error fetching products', error);
      return [];
    }
  }

  getProductById(productId: string): Product | undefined {
    return this.productList().find(p => p.productId.toString() === productId.toString());
  }

  async ReduceProductStock(productId: string, quantity: number): Promise<boolean> {
    // In a real app, this would be an API call. 
    // For now, let's just update local state if successful on backend order creation.
    return true; 
  }
}
