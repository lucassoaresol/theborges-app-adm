import { ITimeOperating } from './IOperatingHour';

export interface IWorkingDay {
  key: number;
  professionalId: number;
  date: Date;
  time: ITimeOperating;
  isClosed: boolean;
  bookings: {
    id: number;
    start: number;
    end: number;
    client: string;
    services: string;
    color: string;
  }[];
}
