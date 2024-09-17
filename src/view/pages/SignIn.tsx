import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAuth } from '@/app/hooks/useAuth';
import { Button } from '@/view/components/ui/Button';
import { Input } from '@/view/components/ui/Input';
import { Label } from '@/view/components/ui/Label';

const schema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type IFormData = z.infer<typeof schema>;

export function SignIn() {
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async ({ username, password }) => {
    try {
      await signIn(username, password);
    } catch {
      toast.error('Credenciais inválidas!');
    }
  });

  return (
    <div className="flex flex-col justify-center mx-auto max-w-[480px] p-6">
      <h1 className="font-semibold text-xl">Acesse sua conta</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-2">
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input id="username" {...register('username')} />

          <ErrorMessage
            errors={errors}
            name="username"
            render={({ message }) => (
              <small className="text-red-400 block">{message}</small>
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
              <small className="text-red-400 block">{message}</small>
            )}
          />
        </div>

        <Button className="mt-3" disabled={isSubmitting}>
          {isSubmitting && 'Entrando...'}
          {!isSubmitting && 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
