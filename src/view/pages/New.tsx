import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Stepper } from '../components/Stepper';
import { CategoryStep } from '../components/steps/CategoryStep';
import { categoryStepSchema } from '../components/steps/CategoryStep/schema';
import { ClientStep } from '../components/steps/ClientStep/All';
import { clientStepSchema } from '../components/steps/ClientStep/schema';
import { ServiceAddStep } from '../components/steps/ServiceAddStep';
import { serviceAddStepSchema } from '../components/steps/ServiceAddStep/schema';
import { ServiceStep } from '../components/steps/ServiceStep';
import { serviceStepSchema } from '../components/steps/ServiceStep/schema';

const schema = z.object({
  categoryStep: categoryStepSchema,
  serviceStep: serviceStepSchema,
  serviceAddStep: serviceAddStepSchema,
  clientStep: clientStepSchema,
});

export type FormData = z.infer<typeof schema>;

export function New() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
              {
                label: 'Serviços Adicionais',
                content: <ServiceAddStep />,
              },
              {
                label: 'Identifique-se',
                content: <ClientStep />,
              },
            ]}
          />
        </form>
      </FormProvider>
    </div>
  );
}
