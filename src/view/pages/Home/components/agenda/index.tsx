/* eslint-disable react/no-array-index-key */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import dayLib from '@/app/lib/dayjs';

import { useHome } from '../../useHome';

import { Header } from './Header';

export function Agenda() {
  const { selectWorkingDay } = useHome();
  const today = selectWorkingDay
    ? dayLib(selectWorkingDay.date).startOf('day')
    : dayLib();
  const generateHourRange = (start: number, end: number) => {
    const hours = [];
    let current = today.add(start, 'm');
    const endTime = today.add(end, 'm');

    while (current.isBefore(endTime) || current.isSame(endTime)) {
      hours.push(current.format('HH:mm'));
      current = current.add(1, 'hour');
    }

    return hours;
  };

  const calculateAgendaHeight = (startTime: number, endTime: number) => {
    const start = today.add(startTime, 'm');
    const end = today.add(endTime, 'm');
    const diffInMinutes = end.diff(start, 'minutes');
    return `${(diffInMinutes / 60 + 1) * 350}px`;
  };

  const calculateTopPosition = (startTime: number, dayStart: number) => {
    const start = today.add(startTime, 'm');
    const startDay = today.add(dayStart, 'm');
    const diffInMinutes = start.diff(startDay, 'minutes');
    return `${(diffInMinutes / 60) * 350}px`;
  };

  const calculateHeight = (startTime: number, endTime: number) => {
    const start = today.add(startTime, 'm');
    const end = today.add(endTime, 'm');
    const diffInMinutes = end.diff(start, 'minutes');
    return `${(diffInMinutes / 60) * 350}px`;
  };

  const breaks = useMemo(
    () => (selectWorkingDay ? selectWorkingDay.time.breaks : []),
    [selectWorkingDay],
  );

  return (
    selectWorkingDay && (
      <div className="mt-6 flex flex-col gap-8 items-center max-w-5xl w-full mb-10">
        <Header selectWorkingDay={selectWorkingDay} />
        <div className="relative w-full max-w-2xl bg-secondary rounded-lg border">
          {/* Altura dinâmica da agenda com base no expediente */}
          <div
            className="relative"
            style={{
              height: calculateAgendaHeight(
                selectWorkingDay.time.start,
                selectWorkingDay.time.end,
              ),
            }}
          >
            {/* Renderizando a lista de horários */}
            <div className="absolute left-0 top-0 w-full h-full">
              {generateHourRange(
                selectWorkingDay.time.start,
                selectWorkingDay.time.end,
              ).map((hour, index) => (
                <div
                  key={index}
                  className="flex items-center h-[350px] border-b border-gray-300"
                >
                  <div className="pl-4 text-secondary-foreground">{hour}</div>
                </div>
              ))}
            </div>

            {/* Renderizar os agendamentos */}
            {selectWorkingDay.bookings.length > 0 &&
              selectWorkingDay.bookings.map((booking) => (
                <Link key={booking.id} to={`/booking/${booking.id}`}>
                  <div
                    className="absolute left-16 w-[75%] text-white p-2 rounded-lg shadow-lg"
                    style={{
                      top: calculateTopPosition(
                        booking.start,
                        selectWorkingDay.time.start,
                      ),
                      height: calculateHeight(booking.start, booking.end),
                      backgroundColor: booking.color,
                    }}
                  >
                    <div className="flex font-medium gap-2">
                      <span>{today.add(booking.start, 'm').format('HH:mm')}</span>
                      {booking.client}
                    </div>
                    <div className="mt-1 text-xs">{booking.services}</div>
                  </div>
                </Link>
              ))}

            {/* Renderizar os breaks como horários bloqueados */}
            {breaks.length > 0 &&
              breaks.map((breakTime, index) => (
                <div
                  key={index}
                  className="absolute left-16 w-[75%] bg-gray-500 text-white p-2 rounded-lg opacity-70" // Estilo de horários bloqueados
                  style={{
                    top: calculateTopPosition(
                      breakTime.start,
                      selectWorkingDay.time.start,
                    ),
                    height: calculateHeight(breakTime.start, breakTime.end),
                  }}
                >
                  <div className="font-medium">Horário Bloqueado</div>
                  <div className="text-sm">
                    {today.add(breakTime.start, 'm').format('HH:mm')} -{' '}
                    {today.add(breakTime.end, 'm').format('HH:mm')}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  );
}
