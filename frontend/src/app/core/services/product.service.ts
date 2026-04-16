import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/api.models';

export interface ProductFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  vegOnly?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/products`;

  getProducts(filters: ProductFilters = {}): Observable<Product[]> {
    let params = new HttpParams();
    if (filters.search?.trim()) params = params.set('search', filters.search.trim());
    if (typeof filters.minPrice === 'number') params = params.set('minPrice', filters.minPrice);
    if (typeof filters.maxPrice === 'number') params = params.set('maxPrice', filters.maxPrice);
    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  createProduct(payload: unknown) {
    return this.http.post<Product>(this.baseUrl, payload);
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  updateProduct(id: string, payload: unknown) {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, payload);
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
