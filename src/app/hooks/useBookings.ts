import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { BookingService } from '../services/BookingService';

export function useBookings() {
  const queryClient = useQueryClient();
  const [bookingId, setBookingId] = useState<string>();

  const { data: booking, isFetching: bookingLoading } = useQuery({
    queryKey: ['booking', bookingId!],
    queryFn: BookingService.get,
    refetchInterval: Infinity,
    enabled: !!bookingId,
  });

  const { mutate: update, isPending: updateLoading } = useMutation({
    mutationFn: BookingService.update,
    onSuccess: (updateBooking) => {
      queryClient.setQueryData(
        ['booking', updateBooking.publicId],
        () => updateBooking,
      );
    },
  });

  return { booking, bookingLoading, update, updateLoading, setBookingId };
}
