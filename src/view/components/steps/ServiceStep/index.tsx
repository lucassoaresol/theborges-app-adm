import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useServices } from '@/app/hooks/useServices';
import { FormData } from '@/view/pages/New';

import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperNextButton, StepperPreviousButton } from '../../Stepper';
import { useStepper } from '../../Stepper/useStepper';
import { Button } from '../../ui/Button';
import { Skeleton } from '../../ui/Skeleton';

export function ServiceStep() {
  const { services, isLoading } = useServices();
  const { nextStep } = useStepper();
  const form = useFormContext<FormData>();

  async function handleNextStep() {
    const isValid = await form.trigger('serviceStep', {
      shouldFocus: true,
    });

    if (isValid) {
      nextStep();
    }
  }

  const servicesData = useMemo(() => {
    const categoryId = form.getValues('categoryStep.categoryId');

    return services.filter((el) => el.categoryId === categoryId);
  }, [form, services]);

  return (
    <div>
      <StepHeader
        title="Serviço"
        description="Selecione o serviço principal desejado."
      />

      {isLoading ? (
        <Skeleton className="h-[40px] w-full rounded-xl" />
      ) : (
        servicesData.map((sv) => (
          <Button
            key={sv.id}
            variant={
              form.getValues('serviceStep.serviceId') === sv.id ? 'default' : 'outline'
            }
            style={{ borderColor: sv.color }}
            className="h-16 w-full mt-2 flex-col items-start"
            onClick={() => {
              const serviceData = {
                serviceId: sv.id,
                durationMinutes: sv.durationMinutes,
                name: sv.name,
                price: sv.price,
                order: 1,
              };
              form.setValue('serviceStep', serviceData);
              form.setValue('serviceAddStep', [serviceData]);
            }}
          >
            <div className="flex justify-between w-full">
              <span className="text-lg font-bold">{sv.name}</span>
              <span className="text-lg font-bold">R$ {sv.price}</span>
            </div>
          </Button>
        ))
      )}
      {form.formState.errors.serviceStep?.message && (
        <small className="text-destructive">
          {form.formState.errors.serviceStep.message}
        </small>
      )}

      <StepperFooter>
        <StepperPreviousButton disabled={form.formState.isSubmitting} />
        <StepperNextButton onClick={handleNextStep} />
      </StepperFooter>
    </div>
  );
}
