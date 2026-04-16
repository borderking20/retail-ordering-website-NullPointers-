export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  discountPrice?: number | null;
  stockQty: number;
  isVeg: boolean;
  packagingType: string;
}

export interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}
