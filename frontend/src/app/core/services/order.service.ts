import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface OrderSummary {
  id: string;
  orderStatus: string;
  grandTotal: number;
  createdAt: string;
  paymentMethod: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/orders`;

  placeOrder() {
    return this.http.post(this.baseUrl, {});
  }

  getMyOrders() {
    return this.http.get<OrderSummary[]>(this.baseUrl);
  }

  getAllOrders() {
    return this.http.get<OrderSummary[]>(`${this.baseUrl}/admin/all`);
  }

  updateStatus(id: string, status: string) {
    return this.http.put<OrderSummary>(`${this.baseUrl}/${id}/status`, { status });
  }

  reorder(id: string) {
    return this.http.post<OrderSummary>(`${this.baseUrl}/${id}/reorder`, {});
  }
}
