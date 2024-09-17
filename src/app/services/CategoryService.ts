import { ICategory } from '@/app/entities/ICategory';

import { httpClient } from './httpClient';

export class CategoryService {
  static async getAll() {
    const { data } = await httpClient.get<{ result: ICategory[] }>('/categories');

    return data.result;
  }
}
