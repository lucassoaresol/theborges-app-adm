import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import dayLib from './dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(minutes: number): string {
  return dayLib().startOf('day').add(minutes, 'minutes').format('HH:mm');
}

export function safeSessionStorageGetItem<T>(key: string): T | null {
  try {
    const data = sessionStorage.getItem(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch {
    return null;
  }
}
