import { IClient } from '@/app/entities/IClient';

import { httpClient } from './httpClient';

interface ICreateClientDTO {
  name: string;
  phone: string;
  birthDay?: number;
  birthMonth?: number;
  wantsPromotions?: boolean;
}

interface IParamsListClientDTO {
  pageParam?: number;
  limit?: number;
}

interface IUpdateClientDTO {
  id: number;
  name?: string;
  phone?: string;
  birthDay?: number;
  birthMonth?: number;
  wantsPromotions?: boolean;
}

export class ClientService {
  static async create({
    name,
    phone,
    birthDay,
    birthMonth,
    wantsPromotions,
  }: ICreateClientDTO) {
    const { data } = await httpClient.post<IClient>('/clients', {
      name,
      phone,
      birthDay,
      birthMonth,
      wantsPromotions,
    });

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

  static async update({
    id,
    birthDay,
    birthMonth,
    name,
    phone,
    wantsPromotions,
  }: IUpdateClientDTO) {
    const { data } = await httpClient.patch<IClient>(`/clients/${id}`, {
      name,
      phone,
      birthDay,
      birthMonth,
      wantsPromotions,
    });

    return data;
  }
}
