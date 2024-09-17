import { IWorkingDay } from '@/app/entities/IWorkingDay';
import dayLib from '@/app/lib/dayjs';

import { BlockScheduleDialog } from './BlockScheduleDialog';
import { NewScheduleDialog } from './new';

interface IHeader {
  selectWorkingDay: IWorkingDay;
}

export function Header({ selectWorkingDay }: IHeader) {
  return dayLib(selectWorkingDay.date).isSame(dayLib(), 'day') ? (
    <div className="w-full flex items-center justify-between">
      <BlockScheduleDialog selectWorkingDay={selectWorkingDay} />

      <div className="text-xl font-bold mb-4 text-center">
        {dayLib(selectWorkingDay.date).format('DD/MM/YYYY')}
      </div>

      <NewScheduleDialog />
    </div>
  ) : (
    <div className="text-xl font-bold mb-4 text-center">
      {dayLib(selectWorkingDay.date).format('DD/MM/YYYY')}
    </div>
  );
}
