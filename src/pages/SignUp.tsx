import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { AuthService } from '@/services/AuthService';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório'),
  phone: z.string(),
  phoneData: z.string()
    .min(15, 'Whatsapp é obrigatório'),
  username: z.string()
    .min(1, 'Username é obrigatório').transform((value) => value.toLowerCase()),
  password: z.string()
    .min(1, 'Senha é obrigatória'),
});

type IFormData = z.infer<typeof schema>;

export function SignUp() {


  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting }, watch, setValue, setError, clearErrors
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
  });



  const handleSubmit = hookFormSubmit(async ({ name, password, phone, username }) => {
    await AuthService.signUp({ name, password, phone, username });

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

  return (
    <div className="min-h-screen flex flex-col justify-center mx-auto max-w-[480px] p-6">
      <h1 className="font-semibold text-xl">Cadastre-se!</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-2">
        <div className="space-y-1">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" {...register('name')} />
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <small className="text-red-400 block">
                {message}
              </small>
            )}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phoneData">Whatsapp</Label>
          <Input id="phoneData" {...register('phoneData')} />
          <ErrorMessage
            errors={errors}
            name="phoneData"
            render={({ message }) => (
              <small className="text-red-400 block">
                {message}
              </small>
            )}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input id="username" {...register('username')} />
          <ErrorMessage
            errors={errors}
            name="username"
            render={({ message }) => (
              <small className="text-red-400 block">
                {message}
              </small>
            )}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" {...register('password')} />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <small className="text-red-400 block">
                {message}
              </small>
            )}
          />
        </div>

        <Button className="mt-3" type='submit' disabled={isSubmitting}>Entrar</Button>
      </form>
    </div>
  );
}
