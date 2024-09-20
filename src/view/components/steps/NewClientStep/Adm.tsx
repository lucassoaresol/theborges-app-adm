import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { useClients } from '@/app/hooks/useClients';
import { useVerifyPhone } from '@/app/hooks/useVerifyPhone';
import { FormData } from '@/view/pages/Booking';

import { PhoneInput } from '../../PhoneInput';
import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperPreviousButton } from '../../Stepper';
import { useStepper } from '../../Stepper/useStepper';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(2, 'O Whatsapp informado é inválido'),
  phoneData: z.string().min(15, 'Whatsapp é obrigatório'),
});

type IFormData = z.infer<typeof schema>;

interface INewClientAdmStep {
  addCreate: () => void;
}

export function NewClientAdmStep({ addCreate }: INewClientAdmStep) {
  const { loading } = useVerifyPhone();
  const { createError, create, createLoading } = useClients();
  const { nextStep } = useStepper();
  const form = useFormContext<FormData>();

  const formCreate = useForm<IFormData>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = formCreate;

  const handleSubmit = hookFormSubmit((data) => {
    create(data, {
      onSuccess: (cl) => {
        reset();
        addCreate();
        form.setValue('clientStep', {
          clientId: cl.id,
          name: cl.name,
          phone: cl.phone,
        });
        nextStep();
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
        <div className="space-y-1">
          <Label className="text-right" htmlFor="name">
            Nome
          </Label>
          <Input id="name" {...register('name')} />
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <small className="text-red-400 block mt-1 ml-1">{message}</small>
            )}
          />
        </div>
        <div className="space-y-1">
          <PhoneInput />
          <ErrorMessage
            errors={errors}
            name="phoneData"
            render={({ message }) => (
              <small className="text-red-400 block mt-1 ml-1">{message}</small>
            )}
          />
        </div>
        {createError && (
          <small className="text-red-400 block mt-1 ml-1">
            Cliente já está cadastrado
          </small>
        )}
      </FormProvider>
      <StepperFooter>
        <StepperPreviousButton onClick={addCreate} />
        <Button
          disabled={isSubmitting || createLoading || loading}
          size="sm"
          onClick={handleSubmit}
        >
          Salvar
        </Button>
      </StepperFooter>
    </div>
  );
}
