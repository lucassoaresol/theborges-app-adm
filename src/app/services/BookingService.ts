import { IBooking } from '../entities/IBooking';

import { httpClient } from './httpClient';

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
    await httpClient.post('/bookings', {
      clientId,
      date,
      endTime,
      professionalId,
      services,
      startTime,
      forPersonName,
    });
  }

  static async get(id: string) {
    const { data } = await httpClient.get<{ result: IBooking }>(`/bookings/${id}`);

    return data.result;
  }

  static async update({ id, status }: IUpdateBookingDTO) {
    const { data } = await httpClient.patch<{ result: IBooking }>(`/bookings/${id}`, {
      status,
    });

    return data.result;
  }
}
