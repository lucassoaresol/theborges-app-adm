/* eslint-disable jsx-a11y/label-has-associated-control */
import { Dayjs } from 'dayjs';

import dayLib from '@/app/lib/dayjs';
import { Input } from '@/view/components/ui/Input';

import { useNewSchedule } from './useNewSchedule';

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

export function ConfirmedDialog() {
  const { selectData, handleSelectData } = useNewSchedule();

  const hour = getFormattedDate(
    dayLib().startOf('day').add(selectData.startTime!, 'm'),
  );

  let totalPrice = 0;

  return (
    <div>
      <div className="mb-4">
        <strong>Cliente:</strong> {selectData.name}
      </div>
      <div className="mb-4">
        <strong>Data e Hora:</strong> {hour}
      </div>

      <div className="mb-4">
        <strong>Serviços Selecionados:</strong>
        <ul className="list-disc list-inside">
          {selectData.services!.map((service) => {
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
        <label htmlFor="forPersonName" className="block mb-2 font-medium">
          Esse agendamento é para outra pessoa?
        </label>
        <Input
          id="forPersonName"
          placeholder="Nome"
          value={selectData.forPersonName}
          onChange={(e) => handleSelectData({ forPersonName: e.target.value })}
        />
      </div>
    </div>
  );
}
