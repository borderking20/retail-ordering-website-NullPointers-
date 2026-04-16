import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Address } from '../../core/models/address.models';
import { AddressService } from '../../core/services/address.service';
import { OrderSummary, OrderService } from '../../core/services/order.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, ReactiveFormsModule],
  template: `
    <h1 class="mb-4 text-3xl font-bold text-[var(--brand-red)]">Profile</h1>
    <section class="mb-4 rounded-xl border bg-white p-4">
      <h2 class="font-semibold">Loyalty</h2>
      <p class="text-sm text-slate-600">Current points: {{ loyaltyPoints }}</p>
    </section>
    <section class="my-4 rounded-xl border bg-white p-4">
      <h2 class="mb-2 font-semibold">Saved Addresses</h2>
      <form class="grid gap-2 md:grid-cols-2" [formGroup]="addressForm" (ngSubmit)="saveAddress()">
        <input class="rounded border p-2" placeholder="Label" formControlName="label" />
        <input class="rounded border p-2" placeholder="Recipient Name" formControlName="recipientName" />
        <input class="rounded border p-2" placeholder="Phone" formControlName="phone" />
        <input class="rounded border p-2" placeholder="Line 1" formControlName="line1" />
        <input class="rounded border p-2" placeholder="Line 2" formControlName="line2" />
        <input class="rounded border p-2" placeholder="City" formControlName="city" />
        <input class="rounded border p-2" placeholder="Pincode" formControlName="pincode" />
        <input class="rounded border p-2" placeholder="Landmark" formControlName="landmark" />
        <label class="text-sm"><input type="checkbox" formControlName="isDefault" /> Default address</label>
        <button class="rounded bg-[var(--brand-red)] px-3 py-2 text-white" [disabled]="addressForm.invalid">Save Address</button>
      </form>
      <div class="mt-3 space-y-2">
        <article class="rounded border p-2" *ngFor="let a of addresses">
          <div class="flex items-center justify-between">
            <p class="text-sm">{{ a.label }} - {{ a.line1 }}, {{ a.city }} {{ a.pincode }}</p>
            <button class="rounded bg-red-100 px-2 py-1 text-xs text-red-700" (click)="deleteAddress(a.id)">Delete</button>
          </div>
        </article>
      </div>
    </section>
    <section class="rounded-xl border bg-white p-4">
      <div class="mb-2 flex items-center justify-between">
        <h2 class="font-semibold">Order History</h2>
        <a routerLink="/menu" class="text-sm text-[var(--brand-red)]">Reorder</a>
      </div>
      <div class="space-y-2" *ngIf="orders.length; else noOrders">
        <article class="rounded border p-3" *ngFor="let order of orders">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Order {{ order.id }}</p>
              <p class="text-xs text-slate-500">{{ order.createdAt | date: 'medium' }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm">{{ order.orderStatus }}</p>
              <p class="font-semibold">Rs {{ order.grandTotal }}</p>
              <button class="mt-1 rounded border px-2 py-1 text-xs" (click)="reorder(order.id)">Reorder</button>
            </div>
          </div>
        </article>
      </div>
      <ng-template #noOrders>
        <p class="text-sm text-slate-500">No orders yet.</p>
      </ng-template>
    </section>
  `,
})
export class ProfilePageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly addressService = inject(AddressService);
  private readonly notificationService = inject(NotificationService);
  orders: OrderSummary[] = [];
  addresses: Address[] = [];
  loyaltyPoints = 120;
  readonly addressForm = this.fb.group({
    label: ['Home', Validators.required],
    recipientName: ['', Validators.required],
    phone: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
    pincode: ['', Validators.required],
    landmark: [''],
    isDefault: [false],
  });

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (orders) => (this.orders = orders),
      error: () => (this.orders = []),
    });
    this.addressService.getMyAddresses().subscribe({
      next: (items) => (this.addresses = items),
      error: () => (this.addresses = []),
    });
  }

  reorder(id: string): void {
    this.orderService.reorder(id).subscribe(() => {
      this.notificationService.show('Reorder placed');
      this.ngOnInit();
    });
  }

  saveAddress(): void {
    if (this.addressForm.invalid) return;
    this.addressService.create(this.addressForm.getRawValue() as Omit<Address, 'id'>).subscribe(() => {
      this.notificationService.show('Address saved');
      this.addressForm.reset({ label: 'Home', recipientName: '', phone: '', line1: '', line2: '', city: '', pincode: '', landmark: '', isDefault: false });
      this.ngOnInit();
    });
  }

  deleteAddress(id: string): void {
    this.addressService.delete(id).subscribe(() => {
      this.notificationService.show('Address deleted');
      this.ngOnInit();
    });
  }
}
