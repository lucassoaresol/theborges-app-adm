/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { IWorkingDay } from '@/entities/IWorkingDay';
import dayLib from '@/lib/dayjs';
import { WorkingDaysService } from '@/services/workingDaysService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdBlock } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { z } from 'zod';
import { useHome } from '../../useHome';


const schema = z.object({
  professionalId: z.number().default(1),
  startHour: z.preprocess((value) => Number(value), z.number().min(0, 'Hora inválida').max(23, 'Hora inválida')),
  startMin: z.preprocess((value) => Number(value), z.number().min(0, 'Minuto inválido').max(59, 'Minuto inválido')),
  endHour: z.preprocess((value) => Number(value), z.number().min(0, 'Hora inválida').max(23, 'Hora inválida')),
  endMin: z.preprocess((value) => Number(value), z.number().min(0, 'Minuto inválido').max(59, 'Minuto inválido')),
  start: z.number().default(0),
  end: z.number().default(0),
}).refine((data) => {
  const startTotalMinutes = data.startHour * 60 + data.startMin;
  const endTotalMinutes = data.endHour * 60 + data.endMin;

  data.start = startTotalMinutes;
  data.end = endTotalMinutes;

  return startTotalMinutes < endTotalMinutes;
}, {
  message: 'O horário de término deve ser maior que o horário de início',
  path: ['endHour']
});

type IFormData = z.infer<typeof schema>;

interface IBlockScheduleDialog {
  selectWorkingDay: IWorkingDay
}


export function BlockScheduleDialog({ selectWorkingDay }: IBlockScheduleDialog) {
  const { handleSelectWorkingDayId } = useHome();
  const [isOpen, setIsOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);


  const today = dayLib(selectWorkingDay.date).startOf('day');

  const isTabletOrDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  });

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

  const hours = generateHourSelect(selectWorkingDay.time.start, selectWorkingDay.time.end);

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting }, reset
  } = useForm<IFormData>({
    defaultValues: { startHour: hours[0], startMin: 0, endHour: hours[0], endMin: 0 },
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await WorkingDaysService.updateWorkingDay(data);
      handleSelectWorkingDayId(selectWorkingDay.key);
      setIsOpen(false);
      reset();
    }
    catch {
      setServerError('Erro ao atualizar os horários, tente novamente.');
    }
  });

  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      <Button size={isTabletOrDesktopOrLaptop ? 'default' : 'icon'} variant='destructive'>
        {isTabletOrDesktopOrLaptop ? 'Bloquear Horário' : <MdBlock />}
      </Button>
    </DialogTrigger>
    <DialogOverlay />
    <DialogContent className='w-full max-w-[425px] sm:max-w-lg'>
      <DialogHeader>
        <DialogTitle>Bloquear Horário de Agendamento</DialogTitle>
        <DialogDescription>
          Defina o horário de início e término para bloquear a agenda durante esse período. Durante o intervalo selecionado, novos agendamentos não poderão ser feitos.
        </DialogDescription>
      </DialogHeader>
      {(Object.keys(errors).length > 0 || serverError) && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <ul>
            {/* Exibir erros de validação */}
            {Object.values(errors).map((error, index) => (
              <li key={index}>{(error as any).message}</li>
            ))}
            {/* Exibir erro do servidor */}
            {serverError && <li>{serverError}</li>}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Início</Label>
            <div className="space-y-1">
              <Label htmlFor="startHour">Hora</Label>
              <Input type='number' id='startHour' min={hours[0]} max={hours.at(-1)} placeholder='Hora' {...register('startHour')} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="startMin">Minuto</Label>
              <Input type='number' min={0} max={59} placeholder='Minuto' id='startMin' {...register('startMin')} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Fim</Label>
            <div className="space-y-1">
              <Label htmlFor="endHour">Hora</Label>
              <Input type='number' id='endHour' min={hours[0]} max={hours.at(-1)} placeholder='Hora' {...register('endHour')} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="endMin">Minuto</Label>
              <Input type='number' min={0} max={59} placeholder='Minuto' id='endMin' {...register('endMin')} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>Salvar alterações</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;



}
