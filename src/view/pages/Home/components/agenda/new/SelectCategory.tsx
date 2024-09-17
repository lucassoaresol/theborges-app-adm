import { Avatar, AvatarImage } from '@/view/components/ui/Avatar';
import { Button } from '@/view/components/ui/Button';
import { Skeleton } from '@/view/components/ui/Skeleton';

import { useNewSchedule } from './useNewSchedule';

export function SelectCategoryDialog() {
  const { categories, selectData, handleSelectData, setStep } = useNewSchedule();

  return categories ? (
    <div>
      {categories.map((cl) => (
        <Button
          key={cl.id}
          variant={selectData.categoryId === cl.id ? 'default' : 'outline'}
          style={{ borderColor: cl.color }}
          className="h-20 w-full mt-2 justify-start gap-3"
          onClick={() => {
            handleSelectData({ categoryId: cl.id, serviceId: undefined });
            setStep((old) => old + 1);
          }}
        >
          <Avatar className="w-14 h-14">
            <AvatarImage src={cl.imageUrl} alt={cl.name} />
          </Avatar>
          <span className="text-lg font-bold">{cl.name}</span>
        </Button>
      ))}
    </div>
  ) : (
    <Skeleton className="h-[40px] w-full rounded-xl" />
  );
}
