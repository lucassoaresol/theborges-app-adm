/* eslint-disable react/no-array-index-key */
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import { ITime } from '@/app/entities/IOperatingHour';
import dayLib from '@/app/lib/dayjs';

import { useHome } from '../../useHome';

import { Header } from './Header';

interface IBooking {
  id: number;
  start: number;
  end: number;
  client: string;
  services: string;
  color: string;
}

export function Agenda() {
  const { selectWorkingDay } = useHome();
  const [newBookingTime, setNewBookingTime] = useState<string | null>(null);
  const [nowPosition, setNowPosition] = useState<number | null>(null); // Estado para a posição da linha de "agora"

  console.log(newBookingTime);

  const today = selectWorkingDay
    ? dayLib(selectWorkingDay.date).startOf('day')
    : dayLib();

  const calculateClickTime = (
    clickY: number,
    agendaHeight: number,
    startTime: number,
  ): number => {
    const totalMinutesInDay = selectWorkingDay!.time.end - selectWorkingDay!.time.start; // Total de minutos no expediente
    const clickPercentage = clickY / agendaHeight; // Posição percentual do clique
    const clickedMinutes = Math.floor(totalMinutesInDay * clickPercentage); // Minutos totais clicados

    return startTime + clickedMinutes;
  };

  const calculateNowPosition = useCallback(() => {
    if (!selectWorkingDay) return null;

    const now = dayLib();
    const startOfDay = today.add(selectWorkingDay.time.start, 'm');

    if (now.isBefore(startOfDay)) {
      return 0; // Antes do horário de expediente
    }

    const minutesSinceStart = now.diff(startOfDay, 'minutes');
    const totalMinutesInDay = selectWorkingDay.time.end - selectWorkingDay.time.start;

    if (minutesSinceStart > totalMinutesInDay) {
      return null; // Após o expediente
    }

    // Calcular a posição em pixels da linha de "agora"
    return (minutesSinceStart / totalMinutesInDay) * (totalMinutesInDay / 60) * 350;
  }, [selectWorkingDay, today]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNowPosition(calculateNowPosition());
    }, 60000); // Atualiza a cada 1 minuto

    // Calcular a posição inicial da linha de "agora"
    setNowPosition(calculateNowPosition());

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [calculateNowPosition, selectWorkingDay, today]);

  const handleAgendaClick = (e: MouseEvent<HTMLDivElement>) => {
    const agendaRect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - agendaRect.top;
    const agendaHeight = agendaRect.height;

    // Calcular o horário baseado na posição do clique
    const clickedTime = calculateClickTime(
      clickY,
      agendaHeight,
      selectWorkingDay!.time.start,
    );

    // Verificar se clicou em um horário sem agendamento ou bloqueio
    const hasBookingOrBreak =
      selectWorkingDay!.bookings.some(
        (booking: IBooking) =>
          clickedTime >= booking.start && clickedTime < booking.end,
      ) ||
      selectWorkingDay!.time.breaks.some(
        (breakTime: ITime) =>
          clickedTime >= breakTime.start && clickedTime < breakTime.end,
      );

    if (!hasBookingOrBreak) {
      // Armazenar o horário clicado e abrir o modal
      setNewBookingTime(today.add(clickedTime, 'm').format('HH:mm'));
      // setModalOpen(true);
    }
  };

  const handleAgendaKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Verificar se a tecla pressionada é "Enter"
    if (e.key === 'Enter') {
      const agendaRect = e.currentTarget.getBoundingClientRect();
      const agendaHeight = agendaRect.height;
      const clickY = agendaHeight / 2; // Simular um clique no meio da agenda, já que não temos posição de cursor no teclado.

      const clickedTime = calculateClickTime(
        clickY,
        agendaHeight,
        selectWorkingDay!.time.start,
      );

      const hasBookingOrBreak =
        selectWorkingDay!.bookings.some(
          (booking: IBooking) =>
            clickedTime >= booking.start && clickedTime < booking.end,
        ) ||
        selectWorkingDay!.time.breaks.some(
          (breakTime: ITime) =>
            clickedTime >= breakTime.start && clickedTime < breakTime.end,
        );

      if (!hasBookingOrBreak) {
        setNewBookingTime(today.add(clickedTime, 'm').format('HH:mm'));
        // setModalOpen(true);
      }
    }
  };

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
            role="button"
            className="relative"
            onClick={handleAgendaClick}
            onKeyDown={handleAgendaKeyDown}
            tabIndex={0}
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

            {/* Linha de "agora" */}
            {dayLib(selectWorkingDay.date).isSame(dayLib(), 'day') &&
              nowPosition !== null && (
                <div
                  className="absolute left-0 w-full h-[2px] bg-red-500"
                  style={{
                    top: `${nowPosition}px`,
                  }}
                >
                  <div className="absolute left-4 bg-red-500 text-white px-2 py-1 rounded">
                    Agora
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    )
  );
}
