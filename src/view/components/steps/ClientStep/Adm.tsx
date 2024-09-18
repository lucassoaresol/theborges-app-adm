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

function normalizePhoneNumber(phone: string) {
  return phone.replace(/\D/g, '');
}

export function ClientAdmStep() {
  const { clients } = useClients();
  const { nextStep } = useStepper();
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState(false);
  const form = useFormContext<FormData>();

  const fuse = useMemo(() => {
    const options = {
      keys: [
        'name',
        'email',
        {
          name: 'phone',
          // Normaliza o número de telefone antes de buscar
          getFn: (client: { phone: string }) => normalizePhoneNumber(client.phone),
        },
      ],
      threshold: 0.3, // Ajuste da sensibilidade da busca
    };

    return new Fuse(clients || [], options);
  }, [clients]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearchTerm(search);
  };

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients.slice(0, 3); // Se não houver termo de busca, retorna os 3 primeiros clientes

    const result = fuse.search(searchTerm); // Faz a busca com Fuse.js
    return result.map(({ item }) => item).slice(0, 3); // Limita a exibição a 3 resultados
  }, [searchTerm, clients, fuse]);

  async function handleNextStep() {
    const isValid = await form.trigger('clientAdmStep', {
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
      <div>
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
              form.getValues('clientAdmStep.clientId') === cl.id ? 'default' : 'outline'
            }
            className="w-full mt-1"
            onClick={() => {
              form.setValue('clientAdmStep', {
                clientId: cl.id,
                name: cl.name,
                phone: cl.phone,
              });
            }}
          >
            {`${cl.name} - ${cl.phone}`}
          </Button>
        ))}
        {form.formState.errors.clientAdmStep?.message && (
          <small className="text-destructive">
            {form.formState.errors.clientAdmStep.message}
          </small>
        )}
      </div>

      <StepperFooter>
        <StepperPreviousButton disabled={form.formState.isSubmitting} />
        <StepperNextButton onClick={handleNextStep} />
      </StepperFooter>
    </div>
  );
}
