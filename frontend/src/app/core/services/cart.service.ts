import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'retail.cart.items';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readInitial());
  readonly items$ = this.itemsSubject.asObservable();

  get snapshot(): CartItem[] {
    return this.itemsSubject.value;
  }

  addProduct(product: Product): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find((x) => x.productId === product.id);
    if (existing) existing.quantity += 1;
    else {
      items.push({
        productId: product.id,
        name: product.name,
        unitPrice: product.discountPrice ?? product.basePrice,
        quantity: 1,
      });
    }
    this.persist(items);
  }

  updateQuantity(productId: string, quantity: number): void {
    const items = this.itemsSubject.value
      .map((x) => (x.productId === productId ? { ...x, quantity: Math.max(1, quantity) } : x))
      .filter((x) => x.quantity > 0);
    this.persist(items);
  }

  remove(productId: string): void {
    this.persist(this.itemsSubject.value.filter((x) => x.productId !== productId));
  }

  clear(): void {
    this.persist([]);
  }

  private persist(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  private readInitial(): CartItem[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as CartItem[];
    } catch {
      return [];
    }
  }
}
