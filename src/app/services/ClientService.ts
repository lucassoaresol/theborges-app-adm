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

  static async getById(id: string) {
    const { data } = await httpClient.get<{ result: IClient }>(`/clients/by-id/${id}`);

    return data.result;
  }

  static async getByPhone(id: string) {
    const { data } = await httpClient.get<{ result: IClient }>(
      `/clients/by-phone/${id}`,
    );

    return data.result;
  }

  static async getByPublicId(id: string) {
    const { data } = await httpClient.get<{ result: IClient }>(
      `/clients/by-public-id/${id}`,
    );

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
