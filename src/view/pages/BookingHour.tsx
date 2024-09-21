import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Stepper } from '../components/Stepper';
import { CategoryStep } from '../components/steps/CategoryStep';
import { categoryStepSchema } from '../components/steps/CategoryStep/schema';
import { ClientAdmStep } from '../components/steps/ClientStep';
import { clientStepSchema } from '../components/steps/ClientStep/schema';
import { ConfirmedHourStep } from '../components/steps/ConfirmedStep';
import { confirmedStepSchema } from '../components/steps/ConfirmedStep/schema';
import { ServiceStep } from '../components/steps/ServiceStep';
import { serviceStepSchema } from '../components/steps/ServiceStep/schema';

const schema = z.object({
  categoryStep: categoryStepSchema,
  serviceStep: serviceStepSchema,
  clientStep: clientStepSchema,
  confirmedStep: confirmedStepSchema,
});

export type FormData = z.infer<typeof schema>;

export function BookingHour() {
  const location = useLocation();
  const navigate = useNavigate();
  const date = location.state?.date as string;
  const startTime = location.state?.startTime as number;
  const endTime = location.state?.endTime as number;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { confirmedStep: { date, startTime, endTime } },
  });

  useEffect(() => {
    if (!date || !startTime || !endTime) {
      navigate('/');
    }
  }, [date, endTime, navigate, startTime]);

  useEffect(() => {
    const { unsubscribe } = form.watch((formData) => {
      sessionStorage.setItem('onboarding-form', JSON.stringify(formData));
    });

    return () => {
      unsubscribe();
    };
  }, [form]);

  const handleSubmit = form.handleSubmit(() => {});

  return (
    <div className="flex flex-col justify-center mx-auto max-w-[480px] p-6">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
          <Stepper
            steps={[
              { label: 'Categoria', content: <CategoryStep /> },
              {
                label: 'Serviço',
                content: <ServiceStep />,
              },
              { label: 'Cliente', content: <ClientAdmStep /> },
              {
                label: 'Confirmação',
                content: <ConfirmedHourStep />,
              },
            ]}
          />
        </form>
      </FormProvider>
    </div>
  );
}
