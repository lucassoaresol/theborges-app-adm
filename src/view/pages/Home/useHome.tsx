import { useQuery } from '@tanstack/react-query';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { IWorkingDay } from '@/app/entities/IWorkingDay';
import { useWorkingDays } from '@/app/hooks/useWorkingDays';
import { WorkingDaysService } from '@/app/services/WorkingDaysService';

interface IHomeProviderValue {
  selectWorkingDay: IWorkingDay | undefined;
  selectWorkingDayId: number | undefined;
  handleSelectWorkingDayId: (id: number) => void;
}

const HomeProviderContext = createContext({} as IHomeProviderValue);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { workingDays } = useWorkingDays();
  const [selectWorkingDayId, setSelectWorkingDayId] = useState<number>();

  const { data: selectWorkingDay, refetch } = useQuery({
    initialData: workingDays?.find((el) => el.key === selectWorkingDayId),
    queryKey: ['WorkingDay', selectWorkingDayId],
    queryFn: () => WorkingDaysService.retrieveWorkingDay(selectWorkingDayId!),
    refetchInterval: 300000, // Recarrega a cada 5 minutos (300000 ms)
    enabled: !!selectWorkingDayId,
  });

  const handleSelectWorkingDayId = useCallback(
    (id: number) => {
      setSelectWorkingDayId(id);
      refetch();
    },
    [refetch],
  );

  const value = useMemo(
    () => ({
      handleSelectWorkingDayId,
      selectWorkingDay,
      selectWorkingDayId,
    }),
    [handleSelectWorkingDayId, selectWorkingDay, selectWorkingDayId],
  );

  return (
    <HomeProviderContext.Provider value={value}>
      {children}
    </HomeProviderContext.Provider>
  );
}

export const useHome = () => {
  const context = useContext(HomeProviderContext);

  if (context === undefined)
    throw new Error('useHome must be used within a HomeProvider');

  return context;
};
