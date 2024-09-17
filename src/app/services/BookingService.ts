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
}
