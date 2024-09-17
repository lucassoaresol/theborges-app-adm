export interface IService {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  color: string;
  categoryId: number;
  isAdditional: boolean;
  additionalPrice: number;
}
