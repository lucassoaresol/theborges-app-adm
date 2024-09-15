import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { useMemo, useState } from 'react';
import { GrScheduleNew } from 'react-icons/gr';
import { useMediaQuery } from 'react-responsive';
import { ConfirmedDialog } from './ConfirmedDialog';
import { SelectCategoryDialog } from './SelectCategory';
import { SelectClientDialog } from './SelectClientDialog';
import { SelectHourDialog } from './SelectHourDialog';
import { SelectServiceDialog } from './SelectService';
import { SelectServiceAddDialog } from './SelectServiceAdd';
import { useNewSchedule } from './useNewSchedule';




export function NewScheduleBaseDialog() {
  const { isValid, step, setStep, isOpen, handleOpen, createSchedule, isCreate } = useNewSchedule();
  const [dialogData, setDialogData] = useState({ title: 'Novo Agendamento', description: 'Selecione o cliente, o serviço e o horário para realizar o agendamento.' });

  const isTabletOrDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  });

  const content = useMemo(() => {
    if (step === 0) {
      setDialogData({ title: 'Seleção de Cliente', description: 'Por favor, escolha o cliente para o agendamento.' });
      return <SelectClientDialog />;
    }

    if (step === 1) {
      setDialogData({ title: 'Seleção de Categoria', description: 'Escolha a categoria de serviços que deseja.' });
      return <SelectCategoryDialog />;
    }

    if (step === 2) {
      setDialogData({ title: 'Seleção de Serviço', description: 'Selecione o serviço principal desejado.' });
      return <SelectServiceDialog />;
    }

    if (step === 3) {
      setDialogData({ title: 'Serviços Adicionais', description: 'Adicione serviços extras ao seu agendamento, se necessário.' });
      return <SelectServiceAddDialog />;
    }

    if (step === 4) {
      setDialogData({ title: 'Escolha de Horário', description: 'Selecione o horário disponível para o agendamento.' });
      return <SelectHourDialog />;
    }

    if (step === 5) {
      setDialogData({ title: 'Confirmação do Agendamento', description: 'Revise os detalhes do agendamento antes de confirmar.' });
      return <ConfirmedDialog />;
    }

    return <></>;
  }, [step]);


  return <Dialog open={isOpen} onOpenChange={handleOpen}>
    <DialogTrigger asChild>
      <Button size={isTabletOrDesktopOrLaptop ? 'default' : 'icon'} >
        {isTabletOrDesktopOrLaptop ? 'Novo Agendamento' : <GrScheduleNew />}
      </Button>
    </DialogTrigger>
    <DialogOverlay />
    <DialogContent className='w-full max-w-[425px] sm:max-w-lg'>
      <DialogHeader>
        <DialogTitle>{dialogData.title}</DialogTitle>
        <DialogDescription>
          {dialogData.description}
        </DialogDescription>
      </DialogHeader>
      {content}
      <DialogFooter className='flex-row justify-between sm:justify-between'>
        <Button disabled={step === 0} variant='ghost' onClick={() => setStep((old) => old - 1)}>Anterior</Button>
        <div className='flex gap-2'>
          <Button disabled={step === 0} variant='outline' onClick={() => setStep(0)}>Início</Button>
          <Button disabled={!isValid || isCreate}
            onClick={() => {
              if (step === 5) {
                createSchedule();
              } else {
                setStep((old) => old + 1);
              }
            }
            }>{step === 5 ? 'Confirmar' : 'Próximo'}</Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>;



}
