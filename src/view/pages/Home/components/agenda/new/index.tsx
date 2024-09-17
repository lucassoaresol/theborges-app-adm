import { NewScheduleBaseDialog } from './NewScheduleDialog';
import { NewScheduleProvider } from './useNewSchedule';

export function NewScheduleDialog() {
  return (
    <NewScheduleProvider>
      <NewScheduleBaseDialog />
    </NewScheduleProvider>
  );
}
