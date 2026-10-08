import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import type { Booking, NewBooking, Paginated, Service, SlotsResponse } from './types';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => api<Paginated<Service>>('/services'),
  });
}

export function useService(id: string | undefined) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => api<{ data: Service }>(`/services/${id}`),
    enabled: Boolean(id),
  });
}

export function useSlots(specialistId: number | null, serviceId: string | undefined, date: string) {
  return useQuery({
    queryKey: ['slots', specialistId, serviceId, date],
    queryFn: () =>
      api<SlotsResponse>(`/specialists/${specialistId}/slots?service_id=${serviceId}&date=${date}`),
    enabled: specialistId !== null && Boolean(serviceId) && Boolean(date),
  });
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => api<Paginated<Booking>>('/bookings'),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewBooking) =>
      api<{ data: Booking }>('/bookings', { method: 'POST', body: input }),
    // onSettled срабатывает и при успехе, и при ошибке: после конфликта 409
    // список слотов обновится, и занятое время исчезнет.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['slots'] });
      void queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api<{ data: Booking }>(`/bookings/${id}/cancel`, { method: 'POST' }),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });
}