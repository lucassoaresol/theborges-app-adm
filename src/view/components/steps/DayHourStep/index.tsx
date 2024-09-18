import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useServices } from '@/app/hooks/useServices';
import { FormData } from '@/view/pages/New';

import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperNextButton, StepperPreviousButton } from '../../Stepper';
import { useStepper } from '../../Stepper/useStepper';
import { Button } from '../../ui/Button';

export function ServiceAddStep() {
  const { services } = useServices();
  const { nextStep } = useStepper();
  const form = useFormContext<FormData>();

  async function handleNextStep() {
    const isValid = await form.trigger('serviceAddStep', {
      shouldFocus: true,
    });

    if (isValid) {
      nextStep();
    }
  }

  const servicesAdd = useMemo(() => form.getValues('serviceAddStep'), [form]);

  const servicesData = useMemo(() => {
    const serviceId = form.getValues('serviceStep.serviceId');

    return services
      .filter((el) => el.id !== serviceId && el.isAdditional)
      .map((itm) => {
        const isAdd = servicesAdd!.some((itm2) => itm2.serviceId === itm.id);
        return {
          ...itm,
          isAdd,
        };
      });
  }, [form, services, servicesAdd]);

  return (
    <div>
      <StepHeader
        title="Serviços Adicionais"
        description="Adicione serviços extras ao seu agendamento, se necessário."
      />

      {servicesData.map((sv) => (
        <Button
          key={sv.id}
          variant={sv.isAdd ? 'default' : 'outline'}
          style={{ borderColor: sv.color }}
          className="h-16 w-full mt-2 flex-col items-start"
          onClick={() => {
            let newServicesAdd = servicesAdd;
            const serviceData = {
              serviceId: sv.id,
              durationMinutes: sv.durationMinutes,
              name: sv.name,
              price: sv.additionalPrice,
            };
            if (sv.isAdd) {
              newServicesAdd = newServicesAdd.filter((itm) => itm.serviceId !== sv.id);
              if (newServicesAdd.length > 1) {
                newServicesAdd = newServicesAdd.map((el) => {
                  if (el.order !== 1) {
                    return { ...el, order: 2 };
                  }
                  return el;
                });
              }
            } else {
              newServicesAdd.push({ ...serviceData, order: newServicesAdd.length + 1 });
            }
            form.setValue('serviceAddStep', newServicesAdd);
          }}
        >
          <div className="flex justify-between w-full">
            <span className="text-lg font-bold">{sv.name}</span>
            <span className="text-lg font-bold">R$ {sv.additionalPrice}</span>
          </div>
        </Button>
      ))}
      <StepperFooter>
        <StepperPreviousButton disabled={form.formState.isSubmitting} />
        <StepperNextButton onClick={handleNextStep} />
      </StepperFooter>
    </div>
  );
}
