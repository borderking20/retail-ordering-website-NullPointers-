import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly productList = signal<Product[]>([
    {
      productId: 'p1',
      productName: 'Fresh Apples',
      description: 'Crisp and sweet fresh apples.',
      productPrice: 250,
      imageUrl: '/images/fresh_apples.png',
      productCategory: 'Fruits',
      productStock: 50
    },
    {
      productId: 'p2',
      productName: 'Organic Bananas',
      description: 'A bunch of ripe bananas.',
      productPrice: 80,
      imageUrl: '/images/organic_bananas.png',
      productCategory: 'Fruits',
      productStock: 30
    },
    {
      productId: 'p3',
      productName: 'Whole Milk',
      description: '1 Gallon of whole milk.',
      productPrice: 65,
      imageUrl: '/images/whole_milk.png',
      productCategory: 'Dairy',
      productStock: 20
    }
  ]);

  async GetAllProductsAsync(): Promise<Product[]> {
    return this.productList();
  }

  getProductById(productId: string): Product | undefined {
    return this.productList().find(p => p.productId === productId);
  }

  async ReduceProductStock(productId: string, productQuantity: number): Promise<boolean> {
    const currentProducts = this.productList();
    const productIndex = currentProducts.findIndex(p => p.productId === productId);
    
    if (productIndex !== -1 && currentProducts[productIndex].productStock >= productQuantity) {
      this.productList.update(products => {
        const updated = [...products];
        updated[productIndex] = {
           ...updated[productIndex], 
           productStock: updated[productIndex].productStock - productQuantity
        };
        return updated;
      });
      return true;
    }
    return false;
  }
}
