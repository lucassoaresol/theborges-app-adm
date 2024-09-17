import { useMemo } from 'react';

import { Button } from '@/view/components/ui/Button';
import { Skeleton } from '@/view/components/ui/Skeleton';

import { useNewSchedule } from './useNewSchedule';

export function SelectServiceDialog() {
  const { services, selectData, handleSelectData, setStep } = useNewSchedule();

  const servicesData = useMemo(() => {
    if (selectData.categoryId && services) {
      return services.filter((el) => el.categoryId === selectData.categoryId);
    }
    return services;
  }, [services, selectData]);

  return servicesData ? (
    <div>
      {servicesData.map((sv) => (
        <Button
          key={sv.id}
          variant={selectData.serviceId === sv.id ? 'default' : 'outline'}
          style={{ borderColor: sv.color }}
          className="h-16 w-full mt-2 flex-col items-start"
          onClick={() => {
            handleSelectData({
              serviceId: sv.id,
              services: [
                {
                  serviceId: sv.id,
                  name: sv.name,
                  price: sv.price,
                  order: 1,
                  durationMinutes: sv.durationMinutes,
                },
              ],
            });
            setStep((old) => old + 1);
          }}
        >
          <div className="flex justify-between w-full">
            <span className="text-lg font-bold">{sv.name}</span>
            <span className="text-lg font-bold">R$ {sv.price}</span>
          </div>
        </Button>
      ))}
    </div>
  ) : (
    <Skeleton className="h-[40px] w-full rounded-xl" />
  );
}
