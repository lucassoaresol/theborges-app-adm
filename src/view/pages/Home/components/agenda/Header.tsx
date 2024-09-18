import { GrScheduleNew } from 'react-icons/gr';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import { IWorkingDay } from '@/app/entities/IWorkingDay';
import dayLib from '@/app/lib/dayjs';
import { Button } from '@/view/components/ui/Button';

import { BlockScheduleDialog } from './BlockScheduleDialog';

interface IHeader {
  selectWorkingDay: IWorkingDay;
}

export function Header({ selectWorkingDay }: IHeader) {
  const isTabletOrDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  });
  return dayLib(selectWorkingDay.date).isSame(dayLib(), 'day') ? (
    <div className="w-full flex items-center justify-between">
      <BlockScheduleDialog selectWorkingDay={selectWorkingDay} />

      <div className="text-xl font-bold mb-4 text-center">
        {dayLib(selectWorkingDay.date).format('DD/MM/YYYY')}
      </div>

      <Button size={isTabletOrDesktopOrLaptop ? 'default' : 'icon'} asChild>
        <Link to="/booking">
          {isTabletOrDesktopOrLaptop ? 'Novo Agendamento' : <GrScheduleNew />}
        </Link>
      </Button>
    </div>
  ) : (
    <div className="text-xl font-bold mb-4 text-center">
      {dayLib(selectWorkingDay.date).format('DD/MM/YYYY')}
    </div>
  );
}
