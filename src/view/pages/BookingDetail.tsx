import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { IBooking } from '@/app/entities/IBooking';
import dayLib from '@/app/lib/dayjs';
import { BookingService } from '@/app/services/BookingService';

import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

export function BookingDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<IBooking>();
  const navigate = useNavigate();

  const onClickCancelled = (bookingId: number) => {
    setLoading(true);
    BookingService.update({ id: bookingId, status: 'CANCELLED' })
      .then((res) => setBookingData(res))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    if (id) {
      BookingService.get(id)
        .then((res) => setBookingData(res))
        .catch(() => navigate('/'))
        .finally(() => setLoading(false));
    } else {
      navigate('/agendar');
    }
  }, [id, navigate]);

  const isBefore = useMemo(() => {
    if (bookingData) {
      const startDateTime = dayLib(bookingData.date)
        .startOf('day')
        .add(bookingData.startTime, 'm');

      const now = dayLib();

      if (
        startDateTime.isBefore(now, 'minute') ||
        bookingData.status === 'CANCELLED' ||
        bookingData.status === 'RESCHEDULED'
      ) {
        return true;
      }
    }
    return false;
  }, [bookingData]);

  const hour = useMemo(() => {
    if (bookingData) {
      const startDateTime = dayLib(bookingData.date)
        .startOf('day')
        .add(bookingData.startTime, 'm');

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
  }, [bookingData]);

  let totalPrice = 0;

  return loading ? (
    <Skeleton className="h-[40px] w-full rounded-xl" />
  ) : (
    bookingData && (
      <div className="flex flex-col justify-center mx-auto max-w-[480px] p-6">
        <div className="mb-4">
          <strong>Cliente:</strong>{' '}
          {bookingData.forPersonName
            ? bookingData.forPersonName
            : bookingData.client.name}
        </div>
        <div className="mb-4">
          <strong>Data e Hora:</strong> {hour}
        </div>

        <div className="mb-4">
          <strong>Serviços Selecionados:</strong>
          <ul className="list-disc list-inside">
            {bookingData.services.map((service) => {
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
              switch (bookingData.status) {
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
              <Link to={`https://wa.me/${bookingData.client.phone}`}>
                Entrar em contato
              </Link>
            </Button>
            <Button variant="default" asChild>
              <Link to={`/booking/b/${bookingData.publicId}`}>Reagendar</Link>
            </Button>
            <Button
              onClick={() => {
                onClickCancelled(bookingData.id);
              }}
              variant="destructive"
            >
              Cancelar
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/">Voltar</Link>
            </Button>
          </div>
        )}
      </div>
    )
  );
}
