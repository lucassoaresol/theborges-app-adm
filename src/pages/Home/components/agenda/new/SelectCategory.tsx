import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useNewSchedule } from './useNewSchedule';






export function SelectCategoryDialog() {
  const { categories, selectData, handleSelectData, setStep
  } = useNewSchedule();

  return categories ? <div>


    {categories.map((cl) =>
      <Button key={cl.id}
        variant={selectData.categoryId === cl.id ? 'default' : 'outline'}
        style={{ borderColor: cl.color }} className='h-20 w-full mt-2 justify-start gap-3'
        onClick={() => {
          handleSelectData({ categoryId: cl.id, serviceId: undefined });
          setStep((old) => old + 1);
        }}>
        <Avatar>
          <AvatarImage src={cl.imageUrl} alt={cl.name} className='h-16 rounded-full' />
        </Avatar><span className='text-lg font-bold'>{cl.name}</span>
      </Button>)
    }
  </div > : <Skeleton className="h-[40px] w-full rounded-xl" />;

}
