import { GrScheduleNew } from 'react-icons/gr';
import { Link } from 'react-router-dom';

import { IWorkingDay } from '@/app/entities/IWorkingDay';
import dayLib from '@/app/lib/dayjs';
import { Button } from '@/view/components/ui/Button';

import { ScheduleDialog } from './ScheduleDialog';

interface IHeader {
  selectWorkingDay: IWorkingDay;
}

export function Header({ selectWorkingDay }: IHeader) {
  return (
    <div className="w-full max-w-2xl flex items-center justify-between">
      <ScheduleDialog selectWorkingDay={selectWorkingDay} />

      <div className="text-xl font-bold mb-4 text-center">
        {dayLib(selectWorkingDay.date).format('DD/MM/YYYY')}
      </div>

      <Button size="icon" asChild>
        <Link to="/booking">
          <GrScheduleNew />
        </Link>
      </Button>
    </div>
  );
}
