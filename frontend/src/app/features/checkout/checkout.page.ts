import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from '../../core/models/address.models';
import { AddressService } from '../../core/services/address.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1 class="text-3xl font-bold text-[var(--brand-red)]">Checkout</h1>
    <div class="mt-4 flex gap-2 text-sm">
      <button class="rounded border px-3 py-1" [class.bg-red-100]="step===1" (click)="step=1">1 Delivery</button>
      <button class="rounded border px-3 py-1" [class.bg-red-100]="step===2" (click)="step=2">2 Payment</button>
      <button class="rounded border px-3 py-1" [class.bg-red-100]="step===3" (click)="step=3">3 Review</button>
    </div>
    <form class="mt-4 space-y-3 rounded-xl border bg-white p-4" [formGroup]="form">
      <div *ngIf="step===1" class="space-y-2">
        <select class="w-full rounded border p-2" formControlName="addressId" (change)="selectAddress($any($event.target).value)">
          <option value="">Select saved address</option>
          <option *ngFor="let a of addresses" [value]="a.id">{{ a.label }} - {{ a.line1 }}, {{ a.city }}</option>
        </select>
        <input class="w-full rounded border p-2" placeholder="Name" formControlName="name" />
        <input class="w-full rounded border p-2" placeholder="Phone" formControlName="phone" />
        <input class="w-full rounded border p-2" placeholder="Address" formControlName="address" />
      </div>
      <div *ngIf="step===2" class="space-y-2">
        <select class="w-full rounded border p-2" formControlName="paymentMethod">
          <option value="COD">COD</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>
      </div>
      <div *ngIf="step===3" class="space-y-1 text-sm">
        <p><strong>Name:</strong> {{ form.value.name }}</p>
        <p><strong>Phone:</strong> {{ form.value.phone }}</p>
        <p><strong>Address:</strong> {{ form.value.address }}</p>
        <p><strong>Payment:</strong> {{ form.value.paymentMethod }}</p>
      </div>
      <div class="flex gap-2">
        <button type="button" class="rounded border px-3 py-2" *ngIf="step>1" (click)="step=step-1">Back</button>
        <button type="button" class="rounded bg-[var(--brand-yellow)] px-3 py-2 text-white" *ngIf="step<3" (click)="nextStep()">Next</button>
        <button type="button" class="rounded bg-[var(--brand-red)] px-4 py-2 text-white" *ngIf="step===3" (click)="placeOrder()">Place Order</button>
      </div>
    </form>
  `,
})
export class CheckoutPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly addressService = inject(AddressService);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  step = 1;
  addresses: Address[] = [];
  readonly form = this.fb.group({
    addressId: [''],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    paymentMethod: ['COD', Validators.required],
  });

  constructor() {
    this.addressService.getMyAddresses().subscribe({
      next: (items) => {
        this.addresses = items;
        const def = items.find((x) => x.isDefault) ?? items[0];
        if (def) this.selectAddress(def.id);
      },
    });
  }

  placeOrder(): void {
    if (this.form.invalid) return;
    this.orderService.placeOrder().subscribe({
      next: (result: any) => {
        this.cartService.clear();
        this.notificationService.show('Order placed successfully');
        this.router.navigateByUrl(`/order-success/${result?.id ?? 'new-order'}`);
      },
    });
  }

  nextStep(): void {
    if (this.step === 1) {
      const deliveryValid = this.form.controls.name.valid && this.form.controls.phone.valid && this.form.controls.address.valid;
      if (!deliveryValid) {
        this.form.controls.name.markAsTouched();
        this.form.controls.phone.markAsTouched();
        this.form.controls.address.markAsTouched();
        this.notificationService.show('Please complete delivery details');
        return;
      }
    }
    this.step += 1;
  }

  selectAddress(addressId: string): void {
    const selected = this.addresses.find((x) => x.id === addressId);
    if (!selected) return;
    this.form.patchValue({
      addressId: selected.id,
      name: selected.recipientName,
      phone: selected.phone,
      address: `${selected.line1}, ${selected.line2}, ${selected.city} ${selected.pincode}`,
    });
  }
}
