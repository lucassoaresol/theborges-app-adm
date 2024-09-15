import { IService } from '@/entities/IService';
import { httpClient } from './httpClient';

export class ServiceService {

  static async getServices() {
    const { data } = await httpClient.get<{ result: IService[] }>('/services');

    return data.result;
  }



}
