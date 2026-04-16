import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Address } from '../models/address.models';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/addresses`;

  getMyAddresses() {
    return this.http.get<Address[]>(this.baseUrl);
  }

  create(address: Omit<Address, 'id'>) {
    return this.http.post<Address>(this.baseUrl, address);
  }

  update(id: string, address: Omit<Address, 'id'>) {
    return this.http.put<Address>(`${this.baseUrl}/${id}`, address);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
