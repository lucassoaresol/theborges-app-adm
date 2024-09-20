import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { BookingService } from '@/app/services/BookingService';

import { Stepper } from '../components/Stepper';
import { ConfirmedBookingStep } from '../components/steps/ConfirmedStep';
import { confirmedBookingStepSchema } from '../components/steps/ConfirmedStep/schema';
import { DayHourBookingStep } from '../components/steps/DayHourStep';
import { dayHourStepSchema } from '../components/steps/DayHourStep/schema';
import { Skeleton } from '../components/ui/Skeleton';

const schema = z.object({
  dayHourStep: dayHourStepSchema,
  confirmedStep: confirmedBookingStepSchema,
});

export type FormData = z.infer<typeof schema>;

export function NewBooking() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setLoading(true);
    if (id) {
      BookingService.get(id)
        .then((res) => {
          form.setValue('confirmedStep.oldId', res.id);
          form.setValue('confirmedStep.clientId', res.clientId);
          form.setValue('confirmedStep.clientName', res.client.name);
          const services: {
            serviceId: number;
            serviceName: string;
            price: number;
            order: number;
            durationMinutes: number;
          }[] = [];
          res.services.forEach((el) => {
            services.push({
              serviceId: el.service.id,
              serviceName: el.service.name,
              price: el.price,
              order: el.order,
              durationMinutes: el.service.durationMinutes,
            });
          });
          form.setValue('confirmedStep.services', services);
        })
        .catch(() => navigate('/agendar'))
        .finally(() => setLoading(false));
    } else {
      navigate('/agendar');
    }
  }, [form, id, navigate]);

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
      {loading ? (
        <Skeleton className="h-[40px] w-full rounded-xl" />
      ) : (
        <FormProvider {...form}>
          <form onSubmit={handleSubmit}>
            <Stepper
              steps={[
                {
                  label: 'Data e Horário',
                  content: <DayHourBookingStep />,
                },
                {
                  label: 'Confirmação',
                  content: <ConfirmedBookingStep />,
                },
              ]}
            />
          </form>
        </FormProvider>
      )}
    </div>
  );
}
