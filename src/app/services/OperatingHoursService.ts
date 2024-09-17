import { IOperatingHour } from '../entities/IOperatingHour';

import { httpClient } from './httpClient';

export class OperatingHoursService {
  static async getAll() {
    const { data } = await httpClient.get<{ result: IOperatingHour[] }>(
      '/operating-hours',
    );

    return data.result;
  }
}
