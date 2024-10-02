/* eslint-disable jsx-a11y/label-has-associated-control */
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { DAYS, MONTHS } from '@/app/config/constants';
import { useClients } from '@/app/hooks/useClients';
import { useVerifyPhone } from '@/app/hooks/useVerifyPhone';
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
  phone: z.string().min(2, 'O Whatsapp informado é inválido'),
  phoneData: z.string().min(12, 'Whatsapp é obrigatório'),
  birthDay: z.number({ required_error: 'Dia do Aniversário é obrigatório' }),
  birthMonth: z.number({ required_error: 'Mês do Aniversário é obrigatório' }),
  wantsPromotions: z.boolean(),
});

type IFormData = z.infer<typeof schema>;

interface INewClientAdmStep {
  addCreate: () => void;
}

export function NewClientStep({ addCreate }: INewClientAdmStep) {
  const { loading, verifyPhone } = useVerifyPhone();
  const { createError, create, update, updateLoading, createLoading } = useClients();
  const { nextStep } = useStepper();
  const form = useFormContext<FormData>();
  const [selectData, setSelectData] = useState<{
    birthDay?: string;
    birthMonth?: string;
  }>();

  const formCreate = useForm<IFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: form.getValues('clientStep.name'),
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
    setError,
  } = formCreate;

  const handleSubmit = hookFormSubmit(async (data) => {
    let isValid = false;

    try {
      await verifyPhone(data.phone);
      isValid = true;
    } catch {
      setError('phoneData', {
        type: 'validate',
        message: 'O Whatsapp informado é inválido',
      });
    }

    if (isValid) {
      if (form.getValues('clientStep.clientId')) {
        update(
          { id: form.getValues('clientStep.clientId'), ...data },
          {
            onSuccess: () => {
              reset();
              setSelectData(undefined);
              nextStep();
            },
          },
        );
      } else {
        create(data, {
          onSuccess: (cl) => {
            reset();
            setSelectData(undefined);
            form.setValue('clientStep', {
              clientId: cl.id,
              name: cl.name,
              phone: cl.phone,
            });
            nextStep();
          },
        });
      }
    }
  });

  return (
    <div>
      <StepHeader
        title="Preencha Seus Dados"
        description="Por favor, digite suas informações de contato para que possamos entrar em contato para confirmar o agendamento."
      />
      <FormProvider {...formCreate}>
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
        <div className="flex space-x-4">
          <div className="w-1/2">
            <Label className="text-right" htmlFor="day">
              Dia do Aniversário
            </Label>
            <Select
              value={selectData?.birthDay}
              onValueChange={(value) => {
                setSelectData((old) => ({ ...old, birthDay: value }));
                setValue('birthDay', parseInt(value, 10));
              }}
            >
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
            <ErrorMessage
              errors={errors}
              name="birthDay"
              render={({ message }) => (
                <small className="text-red-400 block mt-1 ml-1">{message}</small>
              )}
            />
          </div>
          <div className="w-1/2">
            <Label className="text-right" htmlFor="month">
              Mês do Aniversário
            </Label>
            <Select
              value={selectData?.birthMonth}
              onValueChange={(value) => {
                setSelectData((old) => ({ ...old, birthMonth: value }));
                setValue('birthMonth', parseInt(value, 10));
              }}
            >
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
            <ErrorMessage
              errors={errors}
              name="birthMonth"
              render={({ message }) => (
                <small className="text-red-400 block mt-1 ml-1">{message}</small>
              )}
            />
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
        {createError && (
          <small className="text-red-400 block mt-1 ml-1">
            Você já está cadastrado
          </small>
        )}
      </FormProvider>
      <StepperFooter>
        <StepperPreviousButton onClick={addCreate} />
        <Button
          disabled={isSubmitting || createLoading || updateLoading || loading}
          size="sm"
          onClick={handleSubmit}
        >
          Salvar
        </Button>
      </StepperFooter>
    </div>
  );
}
