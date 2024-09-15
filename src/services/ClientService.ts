import { IClient } from '@/entities/IClient';
import { httpClient } from './httpClient';

interface ICreateClientDTO {
  name: string,
  phone: string,

}

interface IParamsListClientDTO {
  search: string,
  take: number,
}

export class ClientService {
  static async createClient({ name, phone }: ICreateClientDTO) {
    const { data } = await httpClient.post<IClient>('/clients', { name, phone });

    return data;
  }

  static async getClients({ search, take
  }: IParamsListClientDTO) {
    const { data } = await httpClient.get<{ result: IClient[] }>('/clients', { params: { search, take } });

    return data.result;
  }

  static async retrieveClient(id: number) {
    const { data } = await httpClient.get<{ result: IClient }>(`/clients/${id}`);

    return data.result;
  }


}
