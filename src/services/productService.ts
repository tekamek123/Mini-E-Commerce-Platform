import apiClient from '@/lib/axios';
import { Product } from '@/types';

export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/products');
  return response.data;
};
