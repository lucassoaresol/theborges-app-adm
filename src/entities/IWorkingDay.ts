

export interface IWorkingDay {
  key: number;
  professionalId: number;
  date: Date;
  time: {
    'end': number,
    'start': number,
    'breaks': [
      {
        'end': number,
        'start': number
      }
    ];
  }
  isClosed: boolean;
  bookings: {
    id: number;
    start: number;
    end: number;
    client: string;
    services: string;
    color: string
  }[];
  createdAt: Date;
  updatedAt: Date;
}
