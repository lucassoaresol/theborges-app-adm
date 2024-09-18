import { IClient } from '@/app/entities/IClient';

import { httpClient } from './httpClient';

interface ICreateClientDTO {
  name: string;
  phone: string;
}

interface IParamsListClientDTO {
  pageParam?: number;
  limit?: number;
}

export class ClientService {
  static async create({ name, phone }: ICreateClientDTO) {
    const { data } = await httpClient.post<IClient>('/clients', { name, phone });

    return data;
  }

  static async getAll({ pageParam = 0, limit = 20 }: IParamsListClientDTO) {
    const { data } = await httpClient.get<{ result: IClient[]; hasMore: boolean }>(
      '/clients',
      {
        params: { skip: pageParam, limit },
      },
    );

    return data;
  }

  static async get(id: string) {
    const { data } = await httpClient.get<{ result: IClient }>(`/clients/${id}`);

    return data.result;
  }
}
