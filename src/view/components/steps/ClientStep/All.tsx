import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { useVerifyPhone } from '@/app/hooks/useVerifyPhone';
import { ClientService } from '@/app/services/ClientService';
import { FormData } from '@/view/pages/New';

import { PhoneInput } from '../../PhoneInput';
import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperPreviousButton } from '../../Stepper';
import { useStepper } from '../../Stepper/useStepper';
import { Button } from '../../ui/Button';
import { NewClientStep } from '../NewClientStep/All';

const schema = z.object({
  phone: z.string().default(''),
  phoneData: z.string().min(15, 'Whatsapp é obrigatório'),
});

type IFormData = z.infer<typeof schema>;

export function ClientStep() {
  const { loading } = useVerifyPhone();
  const { nextStep } = useStepper();
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
      if (!client.birthDay || !client.birthMonth) {
        setNewClient(true);
      } else {
        nextStep();
      }
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
        title="Informações do Cliente"
        description="Digite o número do seu WhatsApp para contato."
      />
      <FormProvider {...formGet}>
        <div className="space-y-1">
          <PhoneInput />
        </div>
        <ErrorMessage
          errors={errors}
          name="phoneData"
          render={({ message }) => (
            <small className="text-red-400 block mt-1 ml-1">{message}</small>
          )}
        />
      </FormProvider>
      <StepperFooter>
        <StepperPreviousButton disabled={form.formState.isSubmitting} />
        <Button
          disabled={isSubmitting || isClient || loading}
          size="sm"
          onClick={handleSubmit}
        >
          Entrar
        </Button>
      </StepperFooter>
    </div>
  );
}
