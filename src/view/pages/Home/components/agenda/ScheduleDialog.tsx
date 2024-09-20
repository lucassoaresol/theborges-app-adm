import { IWorkingDay } from '@/app/entities/IWorkingDay';

import { ClosedOffDialog } from './ClosedOffDialog';
import { OpenDialog } from './OpenDialog';

interface IScheduleDialog {
  selectWorkingDay: IWorkingDay;
}

export function ScheduleDialog({ selectWorkingDay }: IScheduleDialog) {
  return (
    <div className="flex gap-2">
      <OpenDialog selectWorkingDay={selectWorkingDay} />
      <ClosedOffDialog selectWorkingDay={selectWorkingDay} />
    </div>
  );
}
