import dayLib from '../lib/dayjs';

export const formatTime = (minutes: number): string =>
  dayLib().startOf('day').add(minutes, 'minutes').format('HH:mm');
