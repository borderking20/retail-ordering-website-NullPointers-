import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Promotion } from '../models/promotion.models';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/promotions`;

  getActive() {
    return this.http.get<Promotion[]>(`${this.baseUrl}/active`);
  }

  getAll() {
    return this.http.get<Promotion[]>(this.baseUrl);
  }

  create(payload: Promotion) {
    return this.http.post<Promotion>(this.baseUrl, payload);
  }

  update(id: string, payload: Promotion) {
    return this.http.put<Promotion>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  validateCoupon(code: string, subtotal: number) {
    return this.http.post<{ valid: boolean; code: string; discount: number }>(`${this.baseUrl}/validate-coupon`, {
      code,
      subtotal,
    });
  }
}
