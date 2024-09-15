/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { AuthService } from '@/services/AuthService';
import { ClientService } from '@/services/ClientService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNewSchedule } from './useNewSchedule';


const schema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório'),
  phone: z.string().default(''),
  phoneData: z.string()
    .min(15, 'Whatsapp é obrigatório'),
});

type IFormData = z.infer<typeof schema>;



export function NewClientDialog() {
  const { handleSelectData, setStep } = useNewSchedule();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting }, reset, watch, setValue, setError, clearErrors
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const { id, name } = await ClientService.createClient(data);
      handleSelectData({ clientId: id, name, categoryId: undefined });
      setStep((old) => old + 1);
      reset();
    }
    catch {
      setServerError('Erro ao criar o cliente, tente novamente.');
    }
  });

  const normalizePhoneNumber = (value: string | undefined) => {
    if (!value) return '';

    return value
      .replace(/[\D]/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const extractPhoneNumber = (value: string | undefined) => {
    if (!value) return '';

    const phone = `55${value.replace(/[\D]/g, '')}`;

    return phone;
  };



  useEffect(() => {
    const subscription = watch(async (formData, { name }) => {
      const rawPhone = formData.phoneData ?? '';
      const phone = formData.phone ?? '';
      const normalizedPhone = normalizePhoneNumber(rawPhone);

      if (rawPhone !== normalizedPhone) {
        setValue('phoneData', normalizedPhone);
        setValue('phone', extractPhoneNumber(normalizedPhone));
      }


      if (name === 'phone' && phone.length >= 13) {
        AuthService.verifyPhone(phone).then(() =>
          clearErrors('phoneData')
        ).catch(() => setError('phoneData', {
          type: 'validate',
          message: 'O Whatsapp informado é inválido',
        }));
      }

    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, setError]);


  return <div>
    {(Object.keys(errors).length > 0 || serverError) && (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        <ul>
          {/* Exibir erros de validação */}
          {Object.values(errors).map((error, index) => (
            <li key={index}>{(error as any).message}</li>
          ))}
          {/* Exibir erro do servidor */}
          {serverError && <li>{serverError}</li>}
        </ul>
      </div>
    )}
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="space-y-1">
        <Label className="text-right" htmlFor='name'>Nome</Label>
        <Input id='name'  {...register('name')} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="phoneData">Whatsapp</Label>
        <Input id='phoneData' {...register('phoneData')} />
      </div>
      <Button className='mt-2' type="submit" disabled={isSubmitting}>Salvar</Button>
    </form>
  </div>;



}
