import { DAYSOFWEEK } from '@/app/config/constants';
import { ITimeOperating } from '@/app/entities/IOperatingHour';
import { useOperatingHours } from '@/app/hooks/useOperatingHours';
import { formatTime } from '@/app/lib/utils';

export function OperatingHours() {
  const { operatingHours } = useOperatingHours();

  const completeSchedule: {
    dayOfWeek: number;
    time: null | ITimeOperating;
  }[] = Array(7)
    .fill(null)
    .map((_, index) => ({
      dayOfWeek: index,
      time: null,
    }));

  operatingHours.forEach((entry) => {
    const { dayOfWeek, time } = entry;
    completeSchedule[dayOfWeek] = {
      dayOfWeek,
      time,
    };
  });

  const sortedSchedule = [...completeSchedule.slice(1), completeSchedule[0]];

  return (
    <div className="space-y-4">
      {sortedSchedule.map((entry) => {
        const dayName = DAYSOFWEEK[entry.dayOfWeek];

        if (entry.time === null) {
          return (
            <div key={entry.dayOfWeek} className="text-lg">
              <span className="font-semibold">{dayName}:</span> Fechado
            </div>
          );
        }

        const openingTime = formatTime(entry.time.start);
        const closingTime = formatTime(entry.time.end);
        const breakStart = formatTime(entry.time.breaks[0].start);
        const breakEnd = formatTime(entry.time.breaks[0].end);

        return (
          <div key={entry.dayOfWeek} className="text-lg">
            <span className="font-semibold">{dayName}:</span> {openingTime} às{' '}
            {breakStart} - {breakEnd} às {closingTime}
          </div>
        );
      })}
    </div>
  );
}
