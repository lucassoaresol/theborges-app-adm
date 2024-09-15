import { IWorkingDay } from '@/entities/IWorkingDay';
import { WorkingDaysService } from '@/services/workingDaysService';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';



interface IHomeProviderValue {
  workingDays: IWorkingDay[] | undefined
  selectWorkingDay: IWorkingDay | undefined
  selectWorkingDayId: number | undefined
  handleSelectWorkingDayId: (id: number) => void
  isLoading: boolean
}



const HomeProviderContext = createContext({} as IHomeProviderValue);

export function HomeProvider({
  children
}: { children: React.ReactNode }) {
  const [selectWorkingDayId, setSelectWorkingDayId] = useState<number>();





  const { data: workingDays, isLoading } = useQuery({
    queryKey: ['WorkingDays'],
    queryFn: () => WorkingDaysService.getWorkingDays(),
    refetchInterval: 300000, // Recarrega a cada 5 minutos (300000 ms)
  });

  const { data: selectWorkingDay, refetch } = useQuery({
    initialData: workingDays?.find((el) => el.key === selectWorkingDayId),
    queryKey: ['WorkingDay', selectWorkingDayId],
    queryFn: () => WorkingDaysService.retrieveWorkingDay(selectWorkingDayId!),
    refetchInterval: 300000, // Recarrega a cada 5 minutos (300000 ms)
    enabled: !!selectWorkingDayId
  });




  const handleSelectWorkingDayId = (id: number) => {
    setSelectWorkingDayId(id);
    refetch();
  };



  return (
    <HomeProviderContext.Provider value={{ isLoading, handleSelectWorkingDayId, selectWorkingDay, selectWorkingDayId, workingDays }}>
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
