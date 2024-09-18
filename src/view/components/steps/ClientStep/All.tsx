/* eslint-disable react/no-array-index-key */
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { ClientService } from '@/app/services/ClientService';
import { FormData } from '@/view/pages/New';

import { PhoneInput } from '../../PhoneInput';
import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperPreviousButton } from '../../Stepper';
import { Button } from '../../ui/Button';
import { NewClientStep } from '../NewClientStep/All';

const schema = z.object({
  phone: z.string().default(''),
  phoneData: z.string().min(15, 'Whatsapp é obrigatório'),
});

type IFormData = z.infer<typeof schema>;

export function ClientStep() {
  const [isClient, setIsClient] = useState(false);
  const [newClient, setNewClient] = useState(false);

  const formGet = useForm<IFormData>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = formGet;

  const form = useFormContext<FormData>();

  const handleSubmit = hookFormSubmit(async (data) => {
    setIsClient(true);
    try {
      const client = await ClientService.get(data.phone);
      form.setValue('clientStep', {
        clientId: client.id,
        name: client.name,
        phone: client.phone,
      });
      reset();
    } catch {
      form.setValue('clientStep.phone', data.phone);
      setNewClient(true);
    } finally {
      setIsClient(false);
    }
  });

  return newClient ? (
    <NewClientStep addCreate={() => setNewClient((old) => !old)} />
  ) : (
    <div>
      <StepHeader
        title="Seleção de Cliente"
        description="Por favor, escolha o cliente para o agendamento."
      />
      <FormProvider {...formGet}>
        <div>
          {Object.keys(errors).length > 0 && (
            <div
              className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              <ul>
                {/* Exibir erros de validação */}
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{(error as any).message}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-1">
            <PhoneInput />
          </div>
        </div>
      </FormProvider>
      <StepperFooter>
        <StepperPreviousButton disabled={form.formState.isSubmitting} />
        <Button disabled={isSubmitting || isClient} size="sm" onClick={handleSubmit}>
          Entrar
        </Button>
      </StepperFooter>
    </div>
  );
}
