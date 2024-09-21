import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useBookings } from '@/app/hooks/useBookings';
import dayLib from '@/app/lib/dayjs';
import { CancelledBookingAlertDialog } from '@/view/components/CancelledBookingAlertDialog';
import { Button } from '@/view/components/ui/Button';
import { Skeleton } from '@/view/components/ui/Skeleton';

export function BookingDetail() {
  const { id } = useParams();
  const { booking, bookingLoading, setBookingId } = useBookings();
  const navigate = useNavigate();

  const isBefore = useMemo(() => {
    if (booking) {
      const startDateTime = dayLib(booking.date)
        .startOf('day')
        .add(booking.startTime, 'm');

      const now = dayLib();

      if (
        startDateTime.isBefore(now, 'minute') ||
        booking.status === 'CANCELLED' ||
        booking.status === 'RESCHEDULED'
      ) {
        return true;
      }
    }

    return false;
  }, [booking]);

  const hour = useMemo(() => {
    if (booking) {
      const startDateTime = dayLib(booking.date)
        .startOf('day')
        .add(booking.startTime, 'm');

      const now = dayLib();

      if (startDateTime.isBefore(now, 'minute')) {
        return `${startDateTime.format('DD/MM/YYYY')} às ${startDateTime.format('HH:mm')}`;
      }

      if (startDateTime.isSame(now, 'day')) {
        return `hoje às ${startDateTime.format('HH:mm')}`;
      }
      if (startDateTime.isSame(now.add(1, 'day'), 'day')) {
        return `amanhã às ${startDateTime.format('HH:mm')}`;
      }
      if (startDateTime.diff(now, 'day') <= 6) {
        return `${startDateTime.format('dddd')} às ${startDateTime.format('HH:mm')}`;
      }
      return `${startDateTime.format('DD/MM/YYYY')} às ${startDateTime.format('HH:mm')}`;
    }
    return '';
  }, [booking]);

  let totalPrice = 0;

  useEffect(() => {
    if (id) {
      setBookingId(id);
    } else {
      navigate('/');
    }
  }, [id, navigate, setBookingId]);

  return bookingLoading ? (
    <Skeleton className="h-[40px] w-full rounded-xl" />
  ) : (
    booking && (
      <div className="flex flex-col justify-center mx-auto max-w-[480px] p-6">
        <div className="mb-4">
          <strong>Cliente:</strong>{' '}
          {booking.forPersonName ? booking.forPersonName : booking.client.name}
        </div>
        <div className="mb-4">
          <strong>Data e Hora:</strong> {hour}
        </div>

        <div className="mb-4">
          <strong>Serviços Selecionados:</strong>
          <ul className="list-disc list-inside">
            {booking.services.map((service) => {
              totalPrice += service.price;
              return (
                <li key={service.service.name}>
                  {service.service.name} -{' '}
                  <span className="font-semibold">
                    {service.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mb-4">
          <strong>Total: </strong>
          <span className="text-lg font-bold">
            {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <div className="mb-4">
          <strong>Status:</strong>{' '}
          <span className="font-semibold">
            {(() => {
              switch (booking.status) {
                case 'CANCELLED':
                  return 'Cancelado';
                case 'RESCHEDULED':
                  return 'Reagendado';
                case 'CONFIRMED':
                  return 'Confirmado';
                case 'COMPLETED':
                  return 'Concluído';
                default:
                  return 'Desconhecido';
              }
            })()}
          </span>
        </div>
        {isBefore ? (
          <Button variant="secondary" asChild>
            <Link to="/">Voltar</Link>
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Button variant="success" asChild>
              <Link to={`https://wa.me/${booking.client.phone}`}>
                Entrar em contato
              </Link>
            </Button>
            <Button variant="default" asChild>
              <Link to={`/booking/b/${booking.publicId}`}>Reagendar</Link>
            </Button>
            <CancelledBookingAlertDialog bookingId={booking.id} />
            <Button variant="secondary" asChild>
              <Link to="/">Voltar</Link>
            </Button>
          </div>
        )}
      </div>
    )
  );
}
