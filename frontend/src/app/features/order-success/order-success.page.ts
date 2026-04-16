import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-xl rounded-xl border bg-white p-6 text-center">
      <div class="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-green-100 text-2xl text-green-600">✓</div>
      <h1 class="text-2xl font-bold text-green-700">Order Placed Successfully</h1>
      <p class="mt-2 text-slate-600">Order ID: {{ orderId }}</p>
      <p class="text-sm text-slate-500">Estimated delivery: 30-45 minutes</p>
      <div class="mt-5 flex justify-center gap-3">
        <a routerLink="/profile" class="rounded border px-4 py-2">Track Order</a>
        <a routerLink="/menu" class="rounded bg-[var(--brand-red)] px-4 py-2 text-white">Continue Shopping</a>
      </div>
    </div>
  `,
})
export class OrderSuccessPageComponent {
  protected readonly orderId: string;

  constructor(route: ActivatedRoute) {
    this.orderId = route.snapshot.paramMap.get('id') ?? 'N/A';
  }
}
