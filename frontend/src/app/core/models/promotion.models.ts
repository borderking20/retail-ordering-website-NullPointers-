export interface Promotion {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description: string;
}
