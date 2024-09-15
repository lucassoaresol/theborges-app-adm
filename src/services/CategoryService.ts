import { ICategory } from '@/entities/ICategory';
import { httpClient } from './httpClient';



export class CategoryService {


  static async getCategories() {
    const { data } = await httpClient.get<{ result: ICategory[] }>('/categories');

    return data.result;
  }




}
