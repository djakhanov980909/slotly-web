import type { BookingStatus } from '../api/types';

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(price)} ₸`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return rest === 0 ? `${hours} ч` : `${hours} ч ${rest} мин`;
}

const TIME_ZONE = 'Asia/Almaty';

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: TIME_ZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export const statusLabels: Record<BookingStatus, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждена',
  cancelled: 'Отменена',
  completed: 'Завершена',
};