import { IBooking } from '../entities/IBooking';

import { httpClient } from './httpClient';

interface IGetBookingQuery {
  queryKey: string[];
}

interface ICreateBookingDTO {
  date: string;
  startTime: number;
  endTime: number;
  forPersonName?: string;
  clientId: number;
  professionalId: number;
  services: {
    serviceId: number;
    price: number;
    order: number;
  }[];
}

interface IUpdateBookingDTO {
  id: number;
  status: 'CANCELLED' | 'RESCHEDULED';
}

export class BookingService {
  static async createBooking({
    clientId,
    date,
    endTime,
    professionalId,
    services,
    startTime,
    forPersonName,
  }: ICreateBookingDTO) {
    const { data } = await httpClient.post<{ result: IBooking }>('/bookings', {
      clientId,
      date,
      endTime,
      professionalId,
      services,
      startTime,
      forPersonName,
    });

    return data.result;
  }

  static async get({ queryKey }: IGetBookingQuery) {
    const { data } = await httpClient.get<{ result: IBooking }>(
      `/bookings/${queryKey.at(-1)}`,
    );

    return data.result;
  }

  static async update({ id, status }: IUpdateBookingDTO) {
    const { data } = await httpClient.patch<{ result: IBooking }>(`/bookings/${id}`, {
      status,
    });

    return data.result;
  }
}
