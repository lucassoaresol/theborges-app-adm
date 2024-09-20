import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdAdd } from 'react-icons/md';
import { z } from 'zod';

import { IWorkingDay } from '@/app/entities/IWorkingDay';
import dayLib from '@/app/lib/dayjs';
import { WorkingDaysService } from '@/app/services/WorkingDaysService';
import { Button } from '@/view/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/view/components/ui/Dialog';
import { Input } from '@/view/components/ui/Input';
import { Label } from '@/view/components/ui/Label';

import { useHome } from '../../useHome';

const schema = z.object({
  professionalId: z.number().default(1),
  startHour: z.preprocess(
    (value) => Number(value),
    z.number().min(0, 'Hora inválida').max(23, 'Hora inválida'),
  ),
  startMin: z.preprocess(
    (value) => Number(value),
    z.number().min(0, 'Minuto inválido').max(59, 'Minuto inválido'),
  ),
});

type IFormData = z.infer<typeof schema>;

interface IOpenDialog {
  selectWorkingDay: IWorkingDay;
}

export function OpenDialog({ selectWorkingDay }: IOpenDialog) {
  const { handleSelectWorkingDayId } = useHome();
  const [isOpen, setIsOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const today = dayLib(selectWorkingDay.date).startOf('day');

  const generateHourSelect = (start: number, end: number) => {
    const hours = [];
    let current = today.add(start, 'm');
    const endTime = today.add(end, 'm');

    while (current.isBefore(endTime) || current.isSame(endTime)) {
      hours.push(current.hour());
      current = current.add(1, 'hour');
    }

    return hours;
  };

  const hours = generateHourSelect(
    selectWorkingDay.time.start,
    selectWorkingDay.time.end,
  );

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<IFormData>({
    defaultValues: {
      startHour: hours.at(-1),
      startMin: 0,
    },
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const startTotalMinutes = data.startHour * 60 + data.startMin;

      const updatedData = {
        ...data,
        start: startTotalMinutes,
      };

      await WorkingDaysService.updateWorkingDay(updatedData);
      handleSelectWorkingDayId(selectWorkingDay.key);
      setIsOpen(false);
      reset();
    } catch {
      setServerError('Erro ao atualizar o horário, tente novamente.');
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="success">
          <MdAdd />
        </Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent className="w-full max-w-[425px] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ampliar Horário de Atendimento</DialogTitle>
          <DialogDescription>
            Defina o novo horário de encerramento das atividades para ampliar o período
            de atendimento. Durante o intervalo adicional, novos agendamentos poderão
            ser feitos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center w-full gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="startHour">Hora</Label>
              <Input
                type="number"
                id="startHour"
                min={hours.at(-1)}
                max={23}
                placeholder="Hora"
                {...register('startHour')}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="startMin">Minuto</Label>
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="Minuto"
                id="startMin"
                {...register('startMin')}
              />
            </div>
          </div>
          {serverError && (
            <small className="text-red-400 block my-2 ml-1">{serverError}</small>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
