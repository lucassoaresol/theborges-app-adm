import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import dayLib from '@/lib/dayjs';
import { useHome } from '@/pages/Home/useHome';
import { WorkingDaysService } from '@/services/workingDaysService';
import { useEffect, useState } from 'react';
import { useNewSchedule } from './useNewSchedule';



export function SelectHourDialog() {
  const { selectWorkingDay } = useHome();
  const { selectData, handleSelectData, setStep } = useNewSchedule();
  const [hours, setHours] = useState<{
    'display': string,
    'total': number
  }[]>();

  useEffect(() => {

    WorkingDaysService.getFreeTime({
      date: dayLib(selectWorkingDay!.date!).format('YYYY-MM-DD'),
      professionalId: selectData.professionalId,
      requiredMinutes: selectData.services!.reduce((acc, service) => acc + service.durationMinutes, 0),
      isIgnoreBreak: selectData.isIgnoreBreak
    }).then((res) => {
      setHours(res);
    });

  }, [selectData, selectWorkingDay]);


  return hours ? <div className='flex flex-col gap-3'>
    <div className="self-end">
      <Button size='sm' variant={selectData.isIgnoreBreak ? 'default' : 'secondary'} onClick={() => handleSelectData({ isIgnoreBreak: !selectData.isIgnoreBreak, startTime: undefined })}>Ignorar Bloqueados</Button>
    </div>
    <div className='flex gap-2 flex-wrap'>
      {hours.map((hr) =>
        <Button key={hr.total}
          variant={selectData.startTime === hr.total ? 'default' : 'outline'}
          className='p-3'
          onClick={() => {
            handleSelectData({ startTime: hr.total, date: dayLib(selectWorkingDay!.date!).format('YYYY-MM-DD') });
            setStep((old) => old + 1);
          }}
        >
          {hr.display}
        </Button>)
      }
    </div>



  </div > : <Skeleton className="h-[40px] w-full rounded-xl" />;



}
