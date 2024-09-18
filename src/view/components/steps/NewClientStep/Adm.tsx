/* eslint-disable react/no-array-index-key */

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useClients } from '@/app/hooks/useClients';

import { PhoneInput } from '../../PhoneInput';
import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperPreviousButton } from '../../Stepper';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().default(''),
  phoneData: z.string().min(15, 'Whatsapp é obrigatório'),
});

type IFormData = z.infer<typeof schema>;

interface INewClientAdmStep {
  addCreate: () => void;
}

export function NewClientAdmStep({ addCreate }: INewClientAdmStep) {
  const { createError, create } = useClients();

  const form = useForm<IFormData>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const handleSubmit = hookFormSubmit((data) => {
    create(data, {
      onSuccess: () => {
        reset();
        addCreate();
      },
    });
  });

  return (
    <div>
      <StepHeader
        title="Cadastro de Novo Cliente"
        description="Insira os dados necessários para cadastrar um novo cliente no sistema."
      />
      <FormProvider {...form}>
        <div>
          {(Object.keys(errors).length > 0 || createError) && (
            <div
              className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              <ul>
                {/* Exibir erros de validação */}
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{(error as any).message}</li>
                ))}
                {/* Exibir erro do servidor */}
                {createError && <li>Cliente já está cadastrado</li>}
              </ul>
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input id="name" {...register('name')} />
          </div>
          <div className="space-y-1">
            <PhoneInput />
          </div>
        </div>
      </FormProvider>
      <StepperFooter>
        <StepperPreviousButton onClick={addCreate} />
        <Button disabled={isSubmitting} size="sm" onClick={handleSubmit}>
          Salvar
        </Button>
      </StepperFooter>
    </div>
  );
}
