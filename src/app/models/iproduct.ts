export interface Iproduct {
  id: number;
  name: string;
  price: number;
  categoryName: string;
  categoryId: number;
  description: string;
  brand: string;
  stock: number;
  modelYear: number;
  imageUrl?: string;
}
