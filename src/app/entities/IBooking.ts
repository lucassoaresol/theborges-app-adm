import { IClient } from './IClient';
import { IService } from './IService';

interface IBookingService {
  price: number;
  order: number;
  service: IService;
}

export interface IBooking {
  id: number;
  date: Date;
  startTime: number;
  endTime: number;
  status: string;
  forPersonName: string;
  publicId: string;
  clientId: number;
  professionalId: number;
  client: IClient;
  services: IBookingService[];
}
