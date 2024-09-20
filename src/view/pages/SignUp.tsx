import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useVerifyPhone } from '@/app/hooks/useVerifyPhone';
import { AuthService } from '@/app/services/AuthService';
import { Button } from '@/view/components/ui/Button';
import { Input } from '@/view/components/ui/Input';
import { Label } from '@/view/components/ui/Label';

import { PhoneInput } from '../components/PhoneInput';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string(),
  phoneData: z.string().min(15, 'Whatsapp é obrigatório'),
  username: z
    .string()
    .min(1, 'Username é obrigatório')
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type IFormData = z.infer<typeof schema>;

export function SignUp() {
  const { loading } = useVerifyPhone();
  const form = useForm<IFormData>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const handleSubmit = hookFormSubmit(async ({ name, password, phone, username }) => {
    await AuthService.signUp({ name, password, phone, username });
  });

  return (
    <FormProvider {...form}>
      <div className="flex flex-col justify-center mx-auto max-w-[480px] p-6">
        <h1 className="font-semibold text-xl">Cadastre-se!</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-2">
          <div className="space-y-1">
            <Label htmlFor="name">Nome completo</Label>
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

          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...register('username')} />
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ message }) => (
                <small className="text-red-400 block mt-1 ml-1">{message}</small>
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
                <small className="text-red-400 block mt-1 ml-1">{message}</small>
              )}
            />
          </div>

          <Button className="mt-3" type="submit" disabled={isSubmitting || loading}>
            Entrar
          </Button>
        </form>
      </div>
    </FormProvider>
  );
}
