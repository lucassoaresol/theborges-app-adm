import { useMemo } from 'react';

import { Button } from '@/view/components/ui/Button';
import { Skeleton } from '@/view/components/ui/Skeleton';

import { useNewSchedule } from './useNewSchedule';

export function SelectServiceAddDialog() {
  const { services, selectData, handleSelectData } = useNewSchedule();

  const servicesData = useMemo(() => {
    if (services && selectData.serviceId) {
      return services
        .filter((el) => el.id !== selectData.serviceId && el.isAdditional)
        .map((itm) => {
          const isAdd = selectData.services!.some((itm2) => itm2.serviceId === itm.id);
          return {
            ...itm,
            isAdd,
          };
        });
    }
    return null;
  }, [selectData, services]);

  return servicesData ? (
    <div>
      {servicesData.map((sv) => (
        <Button
          key={sv.id}
          variant={sv.isAdd ? 'default' : 'outline'}
          style={{ borderColor: sv.color }}
          className="h-16 w-full mt-2 flex-col items-start"
          onClick={() => {
            const service = {
              serviceId: sv.id,
              name: sv.name,
              price: sv.additionalPrice,
              durationMinutes: sv.durationMinutes,
            };
            let { services: svs } = selectData;
            if (svs) {
              if (sv.isAdd) {
                svs = svs.filter((itm) => itm.serviceId !== sv.id);
                if (svs.length > 1) {
                  svs = svs.map((el) => {
                    if (el.order !== 1) {
                      return { ...el, order: 2 };
                    }
                    return el;
                  });
                }
              } else {
                svs.push({ ...service, order: svs.length + 1 });
              }
            }
            handleSelectData({ services: svs });
          }}
        >
          <div className="flex justify-between w-full">
            <span className="text-lg font-bold">{sv.name}</span>
            <span className="text-lg font-bold">R$ {sv.additionalPrice}</span>
          </div>
        </Button>
      ))}
    </div>
  ) : (
    <Skeleton className="h-[40px] w-full rounded-xl" />
  );
}
