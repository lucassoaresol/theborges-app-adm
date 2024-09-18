import { Dayjs } from 'dayjs';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import dayLib from '@/app/lib/dayjs';
import { BookingService } from '@/app/services/BookingService';
import { FormData } from '@/view/pages/Booking';

import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperPreviousButton } from '../../Stepper';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';

function getFormattedDate(startDateTime: Dayjs): string {
  const now = dayLib();

  if (startDateTime.isSame(now, 'day')) {
    return `hoje às ${startDateTime.format('HH:mm')}`;
  }
  if (startDateTime.isSame(now.add(1, 'day'), 'day')) {
    return `amanhã às ${startDateTime.format('HH:mm')}`;
  }
  if (startDateTime.diff(now, 'day') <= 6) {
    return `${startDateTime.format('dddd')} às ${startDateTime.format('HH:mm')}`;
  }
  return `${startDateTime.format('DD/MM/YYYY')} às ${startDateTime.format('HH:mm')}`;
}

export function ConfirmedStep() {
  const navigate = useNavigate();
  const [isCreate, setIsCreate] = useState(false);
  const form = useFormContext<FormData>();

  const hour = getFormattedDate(
    dayLib().startOf('day').add(form.getValues('dayHourStep.startTime'), 'm'),
  );

  let totalPrice = 0;

  return (
    <div>
      <StepHeader
        title="Confirmação do Agendamento"
        description="Revise os detalhes do agendamento antes de confirmar."
      />

      <div>
        <div className="mb-4">
          <strong>Cliente:</strong> {form.getValues('clientAdmStep.name')}
        </div>
        <div className="mb-4">
          <strong>Data e Hora:</strong> {hour}
        </div>

        <div className="mb-4">
          <strong>Serviços Selecionados:</strong>
          <ul className="list-disc list-inside">
            {form.getValues('serviceAddStep').map((service) => {
              totalPrice += service.price;
              return (
                <li key={service.name}>
                  {service.name} -{' '}
                  <span className="font-semibold">
                    R${' '}
                    {service.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mb-4">
          <strong>Total:</strong>
          <span className="text-lg font-bold">
            {' '}
            R${' '}
            {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <div className="mb-4">
          <Label htmlFor="forPersonName" className="block mb-2 font-medium">
            Esse agendamento é para outra pessoa?
          </Label>
          <Input
            id="forPersonName"
            placeholder="Nome"
            value={form.getValues('confirmedStep.forPersonName')}
            onChange={(e) =>
              form.setValue('confirmedStep.forPersonName', e.target.value)
            }
          />
        </div>
      </div>

      <StepperFooter>
        <StepperPreviousButton disabled={form.formState.isSubmitting} />
        <Button
          disabled={form.formState.isSubmitting || isCreate}
          type="button"
          onClick={async () => {
            setIsCreate(true);
            form.setValue('confirmedStep', {
              clientId: form.getValues('clientAdmStep.clientId'),
              date: form.getValues('dayHourStep.date'),
              startTime: form.getValues('dayHourStep.startTime'),
              endTime:
                form.getValues('dayHourStep.startTime') +
                form.getValues('dayHourStep.durationMinutes'),
              professionalId: 1,
              services: form.getValues('serviceAddStep'),
            });
            BookingService.createBooking(form.getValues('confirmedStep'))
              .then(() => {
                navigate('/');
              })
              .finally(() => {
                setIsCreate(false);
              });
          }}
          size="sm"
        >
          Confirmar
        </Button>
      </StepperFooter>
    </div>
  );
}
