export interface IClient {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthDay: number | null;
  birthMonth: number | null;
  wantsPromotions: boolean;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  bookingCart: {
    id: number;
    selectedDate: Date | null;
    startTime: number | null;
    endTime: number | null;
    professionalId: number | null;
    clientId: number;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}
