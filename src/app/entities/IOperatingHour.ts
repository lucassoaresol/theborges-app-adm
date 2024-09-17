export interface ITime {
  start: number;
  end: number;
}

export interface ITimeOperating extends ITime {
  breaks: ITime[];
}

export interface IOperatingHour {
  id: number;
  dayOfWeek: number;
  time: ITimeOperating;
}
