import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Promotion } from '../../../core/models/promotion.models';
import { NotificationService } from '../../../core/services/notification.service';
import { PromotionService } from '../../../core/services/promotion.service';

@Component({
  selector: 'app-admin-promotions-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1 class="mb-4 text-3xl font-bold text-[var(--brand-red)]">Admin Promotions</h1>
    <div class="grid gap-4 lg:grid-cols-3">
      <form class="space-y-2 rounded-xl border bg-white p-4" [formGroup]="form" (ngSubmit)="save()">
        <input class="w-full rounded border p-2" placeholder="Code" formControlName="code" />
        <input class="w-full rounded border p-2" placeholder="Description" formControlName="description" />
        <input class="w-full rounded border p-2" placeholder="Discount %" type="number" formControlName="discountValue" />
        <input class="w-full rounded border p-2" placeholder="Min order value" type="number" formControlName="minOrderValue" />
        <button class="w-full rounded bg-[var(--brand-red)] py-2 text-white" [disabled]="form.invalid">Save</button>
      </form>
      <section class="space-y-2 lg:col-span-2">
        <article class="rounded-xl border bg-white p-4" *ngFor="let p of promotions">
          <div class="flex items-center justify-between">
            <div><p class="font-medium">{{ p.code }}</p><p class="text-sm text-slate-500">{{ p.description }}</p></div>
            <div class="flex gap-2">
              <button class="rounded border px-3 py-1" (click)="edit(p)">Edit</button>
              <button class="rounded bg-red-100 px-3 py-1 text-red-700" (click)="remove(p.id)">Delete</button>
            </div>
          </div>
        </article>
      </section>
    </div>
  `,
})
export class AdminPromotionsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly promotionService = inject(PromotionService);
  private readonly notificationService = inject(NotificationService);
  promotions: Promotion[] = [];
  editingId: string | null = null;

  readonly form = this.fb.group({
    code: ['', Validators.required],
    description: ['', Validators.required],
    discountValue: [10, Validators.required],
    minOrderValue: [199, Validators.required],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.promotionService.getAll().subscribe((items) => (this.promotions = items));
  }

  edit(p: Promotion): void {
    this.editingId = p.id;
    this.form.patchValue({ code: p.code, description: p.description, discountValue: p.discountValue, minOrderValue: p.minOrderValue });
  }

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const payload: Promotion = {
      id: this.editingId ?? crypto.randomUUID(),
      code: v.code!,
      description: v.description!,
      discountType: 'Percentage',
      discountValue: Number(v.discountValue),
      minOrderValue: Number(v.minOrderValue),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      isActive: true,
    };
    const req$ = this.editingId ? this.promotionService.update(this.editingId, payload) : this.promotionService.create(payload);
    req$.subscribe(() => {
      this.notificationService.show('Promotion saved');
      this.editingId = null;
      this.form.reset({ code: '', description: '', discountValue: 10, minOrderValue: 199 });
      this.load();
    });
  }

  remove(id: string): void {
    this.promotionService.delete(id).subscribe(() => {
      this.notificationService.show('Promotion deleted');
      this.load();
    });
  }
}
