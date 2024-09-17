import { IService } from '@/app/entities/IService';

import { httpClient } from './httpClient';

export class ServiceService {
  static async getAll() {
    const { data } = await httpClient.get<{ result: IService[] }>('/services');

    return data.result;
  }
}
