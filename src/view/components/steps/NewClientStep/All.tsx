/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-array-index-key */

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { DAYS, MONTHS } from '@/app/config/constants';
import { useClients } from '@/app/hooks/useClients';
import { FormData } from '@/view/pages/New';

import { PhoneInput } from '../../PhoneInput';
import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperPreviousButton } from '../../Stepper';
import { useStepper } from '../../Stepper/useStepper';
import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().default(''),
  phoneData: z.string().min(15, 'Whatsapp é obrigatório'),
  birthDay: z.number(),
  birthMonth: z.number(),
  wantsPromotions: z.boolean(),
});

type IFormData = z.infer<typeof schema>;

interface INewClientAdmStep {
  addCreate: () => void;
}

export function NewClientStep({ addCreate }: INewClientAdmStep) {
  const { createError, create } = useClients();
  const { nextStep } = useStepper();
  const form = useFormContext<FormData>();

  const formCreate = useForm<IFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phoneData: form.getValues('clientStep.phone'),
      wantsPromotions: true,
    },
  });

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
  } = formCreate;

  const handleSubmit = hookFormSubmit((data) => {
    create(data, {
      onSuccess: (cl) => {
        reset();
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
        title="Preencha Seus Dados"
        description="Por favor, digite suas informações de contato para que possamos entrar em contato para confirmar o agendamento."
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
          <div className="flex space-x-4">
            {/* Select para o dia */}
            <div className="w-1/2">
              <Label className="text-right" htmlFor="day">
                Dia do Aniversário
              </Label>
              <Select onValueChange={(e) => setValue('birthDay', parseInt(e, 10))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Dia do Aniversário</SelectLabel>
                    {DAYS.map((el) => (
                      <SelectItem value={String(el)} key={el}>
                        {el}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Select para o mês */}
            <div className="w-1/2">
              <Label className="text-right" htmlFor="month">
                Mês do Aniversário
              </Label>
              <Select onValueChange={(e) => setValue('birthMonth', parseInt(e, 10))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Mês do Aniversário</SelectLabel>
                    {MONTHS.map((el) => (
                      <SelectItem value={String(el.id)} key={el.id}>
                        {el.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-2 mt-2">
            <Checkbox
              id="ignore"
              checked={getValues('wantsPromotions')}
              onCheckedChange={(checked: any) => setValue('wantsPromotions', !!checked)}
            />
            <label
              htmlFor="ignore"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Quero receber as novidades da barbearia no WhatsApp.
            </label>
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
