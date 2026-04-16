import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Promotion } from '../../core/models/promotion.models';
import { NotificationService } from '../../core/services/notification.service';
import { PromotionService } from '../../core/services/promotion.service';

@Component({
  selector: 'app-promotions-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="mb-4 text-3xl font-bold text-[var(--brand-red)]">Promotions</h1>
    <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3" *ngIf="promotions.length; else emptyPromos">
      <article class="rounded-xl border bg-white p-4" *ngFor="let promo of promotions">
        <p class="text-sm text-slate-500">Use Code</p>
        <h3 class="text-xl font-bold">{{ promo.code }}</h3>
        <p class="mt-2 text-sm text-slate-600">{{ promo.description }}</p>
        <p class="mt-2 text-sm">Min order Rs {{ promo.minOrderValue }}</p>
        <button class="mt-3 rounded bg-[var(--brand-red)] px-3 py-2 text-white" (click)="copyCode(promo.code)">Copy Code</button>
      </article>
    </div>
    <ng-template #emptyPromos>
      <div class="rounded-xl border bg-white p-4 text-sm text-slate-500">No active promotions right now.</div>
    </ng-template>
  `,
})
export class PromotionsPageComponent implements OnInit {
  private readonly promotionService = inject(PromotionService);
  private readonly notificationService = inject(NotificationService);
  promotions: Promotion[] = [];

  ngOnInit(): void {
    this.promotionService.getActive().subscribe({
      next: (items) => (this.promotions = items),
      error: () => (this.promotions = []),
    });
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
    this.notificationService.show('Coupon code copied');
  }
}
