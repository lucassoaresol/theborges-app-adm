/* eslint-disable jsx-a11y/label-has-associated-control */
import { max, min, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useWorkingDays } from '@/app/hooks/useWorkingDays';
import dayLib from '@/app/lib/dayjs';
import { WorkingDaysService } from '@/app/services/WorkingDaysService';
import { FormData } from '@/view/pages/Booking';

import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperNextButton, StepperPreviousButton } from '../../Stepper';
import { useStepper } from '../../Stepper/useStepper';
import { Button } from '../../ui/Button';
import { Calendar } from '../../ui/Calendar';
import { Checkbox } from '../../ui/Checkbox';
import { Skeleton } from '../../ui/Skeleton';

export function DayHourAdmStep() {
  const [isIgnoreBreak, setIsIgnoreBreak] = useState(false);
  const { isLoading, workingDays } = useWorkingDays();
  const { nextStep } = useStepper();
  const form = useFormContext<FormData>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hours, setHours] = useState<
    {
      display: string;
      total: number;
    }[]
  >();

  const workingDayDates = useMemo(
    () =>
      workingDays.map((day) =>
        typeof day.date === 'string' ? parseISO(day.date) : day.date,
      ),
    [workingDays],
  );

  const minDate = useMemo(() => min(workingDayDates), [workingDayDates]);

  const maxDate = useMemo(() => max(workingDayDates), [workingDayDates]);

  const closedDays = useMemo(
    () =>
      workingDays
        .filter((day) => day.isClosed)
        .map((day) => (typeof day.date === 'string' ? parseISO(day.date) : day.date)),
    [workingDays],
  );

  async function handleNextStep() {
    const isValid = await form.trigger('serviceAddStep', {
      shouldFocus: true,
    });

    if (isValid) {
      nextStep();
    }
  }

  useEffect(() => {
    const date = dayLib(selectedDate).format('YYYY-MM-DD');
    const requiredMinutes = form
      .getValues('serviceAddStep')
      .reduce((acc, service) => acc + service!.durationMinutes!, 0);
    form.setValue('dayHourStep.durationMinutes', requiredMinutes);
    form.setValue('dayHourStep.date', date);

    WorkingDaysService.getFreeTime({
      date,
      professionalId: 1,
      requiredMinutes,
      isIgnoreBreak,
    }).then((res) => {
      setHours(res);
    });
  }, [form, isIgnoreBreak, selectedDate]);

  return (
    <div>
      <StepHeader
        title="Serviços Adicionais"
        description="Adicione serviços extras ao seu agendamento, se necessário."
      />
      <div className="flex items-center space-x-2 mb-2">
        <Checkbox
          id="ignore"
          checked={isIgnoreBreak}
          onCheckedChange={(checked: any) => setIsIgnoreBreak(!!checked)}
        />
        <label
          htmlFor="ignore"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Ignorar Bloqueados
        </label>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        {isLoading ? (
          <Skeleton className="h-[40px] w-full rounded-xl" />
        ) : (
          <div className="w-full md:w-auto">
            <Calendar
              mode="single"
              fromDate={minDate}
              toDate={maxDate}
              disabled={closedDays}
              locale={ptBR}
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
              }}
            />
          </div>
        )}

        <div className="mt-4 flex flex-col gap-4 md:mt-0 md:w-auto md:flex-row md:flex-wrap md:justify-end">
          {hours &&
            hours.map((hr) => (
              <Button
                key={hr.total}
                variant={
                  form.getValues('dayHourStep.startTime') === hr.total
                    ? 'default'
                    : 'outline'
                }
                className={`p-3 ${form.getValues('dayHourStep.startTime') === hr.total ? 'bg-green-500 hover:bg-green-600' : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'}`}
                onClick={() => {
                  const dayHourStep = form.getValues('dayHourStep');
                  form.setValue('dayHourStep', {
                    ...dayHourStep,
                    startTime: hr.total,
                  });
                }}
              >
                {hr.display}
              </Button>
            ))}
        </div>
      </div>
      {form.formState.errors.dayHourStep?.message && (
        <small className="text-destructive">
          {form.formState.errors.dayHourStep.message}
        </small>
      )}
      <StepperFooter>
        <StepperPreviousButton disabled={form.formState.isSubmitting} />
        <StepperNextButton onClick={handleNextStep} />
      </StepperFooter>
    </div>
  );
}
