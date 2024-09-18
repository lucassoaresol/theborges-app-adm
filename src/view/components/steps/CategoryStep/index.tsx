import { useFormContext } from 'react-hook-form';

import { useCategories } from '@/app/hooks/useCategories';
import { FormData } from '@/view/pages/New';

import { StepHeader } from '../../StepHeader';
import { StepperFooter, StepperNextButton } from '../../Stepper';
import { useStepper } from '../../Stepper/useStepper';
import { Avatar, AvatarImage } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import { Skeleton } from '../../ui/Skeleton';

export function CategoryStep() {
  const { categories, isLoading } = useCategories();
  const { nextStep } = useStepper();
  const form = useFormContext<FormData>();

  async function handleNextStep() {
    const isValid = await form.trigger('categoryStep', {
      shouldFocus: true,
    });

    if (isValid) {
      nextStep();
    }
  }

  return (
    <div>
      <StepHeader
        title="Categoria"
        description="Escolha a categoria de serviços que deseja."
      />

      {isLoading ? (
        <Skeleton className="h-[40px] w-full rounded-xl" />
      ) : (
        categories.map((cl) => (
          <Button
            key={cl.id}
            variant={
              form.getValues('categoryStep.categoryId') === cl.id
                ? 'default'
                : 'outline'
            }
            style={{ borderColor: cl.color }}
            className="h-20 w-full mt-2 justify-start gap-3"
            onClick={() => form.setValue('categoryStep.categoryId', cl.id)}
          >
            <Avatar className="w-14 h-14">
              <AvatarImage src={cl.imageUrl} alt={cl.name} />
            </Avatar>
            <span className="text-lg font-bold">{cl.name}</span>
          </Button>
        ))
      )}
      {form.formState.errors.categoryStep?.message && (
        <small className="text-destructive">
          {form.formState.errors.categoryStep.message}
        </small>
      )}

      <StepperFooter>
        <StepperNextButton onClick={handleNextStep} />
      </StepperFooter>
    </div>
  );
}
