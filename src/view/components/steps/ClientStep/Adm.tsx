import { ErrorMessage } from '@hookform/error-message';
import Fuse from 'fuse.js';
import { ChangeEvent, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useClients } from '@/app/hooks/useClients';
import { FormData } from '@/view/pages/Booking';

import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperNextButton, StepperPreviousButton } from '../../Stepper';
import { useStepper } from '../../Stepper/useStepper';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { NewClientAdmStep } from '../NewClientStep';

export function ClientAdmStep() {
  const { clients } = useClients();
  const { nextStep } = useStepper();
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState(false);
  const form = useFormContext<FormData>();

  const fuse = useMemo(() => {
    const options = {
      keys: ['name', 'email', 'phone'],
      threshold: 0.1,
    };

    return new Fuse(clients || [], options);
  }, [clients]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearchTerm(search);
  };

  const normalizeSearch = (search: string) => {
    let valueReturn = search.replace(/\u202A/g, '');

    if (valueReturn.startsWith('+')) {
      valueReturn = valueReturn.slice(1);
    }

    if (parseInt(valueReturn, 10)) {
      valueReturn = valueReturn.replace(/\D/g, '');
    }

    return valueReturn;
  };

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients.slice(0, 3);

    const result = fuse.search(normalizeSearch(searchTerm));
    return result.map(({ item }) => item).slice(0, 3);
  }, [searchTerm, clients, fuse]);

  async function handleNextStep() {
    const isValid = await form.trigger('clientStep', {
      shouldFocus: true,
    });

    if (isValid) {
      nextStep();
    }
  }

  return newClient ? (
    <NewClientAdmStep addCreate={() => setNewClient((old) => !old)} />
  ) : (
    <div>
      <StepHeader
        title="Seleção de Cliente"
        description="Por favor, escolha o cliente para o agendamento."
      />

      <div className="flex items-center mb-4 gap-2">
        <Input
          onChange={handleSearch}
          value={searchTerm}
          placeholder="Buscar cliente"
        />
        <Button size="sm" onClick={() => setNewClient(true)}>
          Novo Cliente
        </Button>
      </div>
      {filteredClients.length === 0 && <p>Nenhum cliente encontrado</p>}
      {filteredClients.map((cl) => (
        <Button
          key={cl.id}
          variant={
            form.getValues('clientStep.clientId') === cl.id ? 'default' : 'outline'
          }
          className="w-full mt-1"
          onClick={() => {
            form.setValue('clientStep', {
              clientId: cl.id,
              name: cl.name,
              phone: cl.phone,
            });
          }}
        >
          {`${cl.name} - ${cl.phone}`}
        </Button>
      ))}
      <ErrorMessage
        errors={form.formState.errors}
        name="clientStep"
        render={({ message }) => (
          <small className="text-red-400 block mt-1 ml-1">{message}</small>
        )}
      />

      <StepperFooter>
        <StepperPreviousButton disabled={form.formState.isSubmitting} />
        <StepperNextButton onClick={handleNextStep} />
      </StepperFooter>
    </div>
  );
}
