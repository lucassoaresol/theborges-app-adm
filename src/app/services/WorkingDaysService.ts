import { IWorkingDay } from '@/app/entities/IWorkingDay';

import { httpClient } from './httpClient';

interface IUpdateWorkingDayDTO {
  professionalId: number;
  start: number;
  end?: number;
}

interface IFreeTimeDTO {
  requiredMinutes: number;
  date: string;
  professionalId: number;
  isIgnoreBreak?: boolean;
}

export class WorkingDaysService {
  static async getAll() {
    const { data } = await httpClient.get<{ result: IWorkingDay[] }>('/working-days');

    return data.result;
  }

  static async retrieveWorkingDay(id: number) {
    const { data } = await httpClient.get<{ result: IWorkingDay }>(
      `/working-days/${id}`,
    );

    return data.result;
  }

  static async updateWorkingDay({ end, professionalId, start }: IUpdateWorkingDayDTO) {
    await httpClient.patch('/working-days', { end, professionalId, start });
  }

  static async getFreeTime({
    date,
    professionalId,
    requiredMinutes,
    isIgnoreBreak,
  }: IFreeTimeDTO) {
    const { data } = await httpClient.post<
      {
        display: string;
        total: number;
      }[]
    >('/working-days/free-time', {
      date,
      professionalId,
      requiredMinutes,
      isIgnoreBreak,
    });

    return data;
  }
}
