export interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  productStock: number;
  productCategory: string;
  description?: string;
  imageUrl?: string;
}
