import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { PromotionService } from '../../core/services/promotion.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1 class="mb-4 text-3xl font-bold text-[var(--brand-red)]">Your Cart</h1>
    <div class="space-y-3" *ngIf="items$ | async as items">
      <article class="rounded-xl border bg-white p-4" *ngFor="let item of items">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="font-semibold">{{ item.name }}</h3>
            <p class="text-sm text-slate-600">Rs {{ item.unitPrice }} x {{ item.quantity }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="rounded border px-2" (click)="decrease(item.productId, item.quantity)">-</button>
            <span>{{ item.quantity }}</span>
            <button class="rounded border px-2" (click)="increase(item.productId, item.quantity)">+</button>
            <button class="rounded bg-red-100 px-2 py-1 text-red-700" (click)="remove(item.productId)">Remove</button>
          </div>
        </div>
      </article>
      <div class="rounded bg-white p-4">
        <p class="font-semibold">Subtotal: Rs {{ total$ | async }}</p>
        <p class="mt-1 text-sm text-green-700" *ngIf="discount > 0">Coupon Discount: - Rs {{ discount }}</p>
        <p class="mt-1 font-semibold">Grand Total: Rs {{ (total$ | async)! - discount }}</p>
      </div>
      <div class="rounded bg-white p-4">
        <p class="mb-2 text-sm font-medium">Apply Coupon</p>
        <div class="flex gap-2">
          <input class="flex-1 rounded border p-2" [(ngModel)]="couponCode" placeholder="Enter code" />
          <button class="rounded bg-[var(--brand-red)] px-3 py-2 text-white" (click)="applyCoupon()">Apply</button>
        </div>
        <p class="mt-2 text-sm text-green-700" *ngIf="discount > 0">Discount: Rs {{ discount }}</p>
      </div>
      <a href="/checkout" class="block rounded bg-[var(--brand-red)] px-4 py-2 text-center text-white">Proceed to Checkout</a>
      <p class="text-sm text-slate-500" *ngIf="items.length === 0">Your cart is empty.</p>
    </div>
  `,
})
export class CartPageComponent {
  private readonly cartService = inject(CartService);
  private readonly promotionService = inject(PromotionService);
  private readonly notificationService = inject(NotificationService);
  readonly items$ = this.cartService.items$;
  readonly total$ = this.items$.pipe(map((items) => items.reduce((sum, x) => sum + x.unitPrice * x.quantity, 0)));
  couponCode = '';
  discount = 0;

  increase(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity + 1);
  }

  decrease(productId: string, quantity: number): void {
    if (quantity <= 1) return;
    this.cartService.updateQuantity(productId, quantity - 1);
  }

  remove(productId: string): void {
    this.cartService.remove(productId);
  }

  applyCoupon(): void {
    const subtotal = this.cartService.snapshot.reduce((sum, x) => sum + x.unitPrice * x.quantity, 0);
    if (!this.couponCode.trim()) return;
    this.promotionService.validateCoupon(this.couponCode.trim(), subtotal).subscribe({
      next: (res) => {
        this.discount = Number(res.discount ?? 0);
        this.notificationService.show('Coupon applied');
      },
    });
  }
}
