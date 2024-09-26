import { useBookings } from '@/app/hooks/useBookings';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/AlertDialog';
import { Button } from './ui/Button';

interface INoShowBookingAlertDialog {
  bookingId: number;
}

export function NoShowBookingAlertDialog({ bookingId }: INoShowBookingAlertDialog) {
  const { update, updateLoading } = useBookings();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={updateLoading}>
          Confirmar Não Comparecimento
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar ausência do cliente</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a confirmar que o cliente não compareceu ao agendamento.
            Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => update({ id: bookingId, status: 'NO_SHOW' })}
          >
            Confirmar Não Comparecimento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
