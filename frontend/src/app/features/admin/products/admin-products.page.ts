import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../core/models/api.models';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1 class="mb-4 text-3xl font-bold text-[var(--brand-red)]">Admin Products</h1>
    <div class="grid gap-4 lg:grid-cols-3">
      <form class="space-y-2 rounded-xl border bg-white p-4" [formGroup]="form" (ngSubmit)="save()">
        <h2 class="font-semibold">{{ editingId ? 'Edit Product' : 'Add Product' }}</h2>
        <input class="w-full rounded border p-2" placeholder="Name" formControlName="name" />
        <input class="w-full rounded border p-2" placeholder="Slug" formControlName="slug" />
        <textarea class="w-full rounded border p-2" placeholder="Description" formControlName="description"></textarea>
        <input class="w-full rounded border p-2" placeholder="Base Price" type="number" formControlName="basePrice" />
        <input class="w-full rounded border p-2" placeholder="Stock Qty" type="number" formControlName="stockQty" />
        <button class="w-full rounded bg-[var(--brand-red)] py-2 text-white" [disabled]="form.invalid">Save</button>
      </form>
      <section class="space-y-2 lg:col-span-2">
        <article class="rounded-xl border bg-white p-4" *ngFor="let p of products">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold">{{ p.name }}</h3>
              <p class="text-sm text-slate-500">Rs {{ p.discountPrice ?? p.basePrice }} | Stock {{ p.stockQty }}</p>
            </div>
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
export class AdminProductsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly notificationService = inject(NotificationService);

  products: Product[] = [];
  editingId: string | null = null;
  readonly form = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    description: ['', Validators.required],
    basePrice: [0, Validators.required],
    stockQty: [0, Validators.required],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.productService.getProducts().subscribe((items) => (this.products = items));
  }

  edit(product: Product): void {
    this.editingId = product.id;
    this.form.patchValue({
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      stockQty: product.stockQty,
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const payload = {
      id: this.editingId ?? crypto.randomUUID(),
      name: v.name!,
      slug: v.slug!,
      description: v.description!,
      categoryId: '20000000-0000-0000-0000-000000000001',
      brandId: '30000000-0000-0000-0000-000000000001',
      packagingType: 'Box',
      basePrice: Number(v.basePrice ?? 0),
      discountPrice: null,
      stockQty: Number(v.stockQty ?? 0),
      isVeg: true,
      isFeatured: false,
      isActive: true,
    };

    const request$ = this.editingId
      ? this.productService.updateProduct(this.editingId, payload)
      : this.productService.createProduct(payload);

    request$.subscribe(() => {
      this.notificationService.show(this.editingId ? 'Product updated' : 'Product created');
      this.editingId = null;
      this.form.reset({ name: '', slug: '', description: '', basePrice: 0, stockQty: 0 });
      this.load();
    });
  }

  remove(id: string): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.notificationService.show('Product deleted');
      this.load();
    });
  }
}
