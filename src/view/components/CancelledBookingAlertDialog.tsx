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

interface ICancelledBookingAlertDialog {
  bookingId: number;
}

export function CancelledBookingAlertDialog({
  bookingId,
}: ICancelledBookingAlertDialog) {
  const { update, updateLoading } = useBookings();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={updateLoading}>
          Cancelar Agendamento
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não poderá ser desfeita. Isso cancelará permanentemente o seu
            agendamento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => update({ id: bookingId, status: 'CANCELLED' })}
          >
            Confirmar Cancelamento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
