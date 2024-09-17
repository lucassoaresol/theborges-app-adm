import { useQuery } from '@tanstack/react-query';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ICategory } from '@/app/entities/ICategory';
import { IClient } from '@/app/entities/IClient';
import { IService } from '@/app/entities/IService';
import { BookingService } from '@/app/services/BookingService';
import { CategoryService } from '@/app/services/CategoryService';
import { ClientService } from '@/app/services/ClientService';
import { ServiceService } from '@/app/services/ServiceService';
import { useHome } from '@/view/pages/Home/useHome';

interface IDataSelect {
  clientId?: number;
  name?: string;
  categoryId?: number;
  serviceId?: number;
  date?: string;
  startTime?: number;
  isIgnoreBreak?: boolean;
  forPersonName?: string;
  services?: {
    serviceId: number;
    name: string;
    price: number;
    order: number;
    durationMinutes: number;
  }[];
}

interface IData extends IDataSelect {
  professionalId: number;
  isIgnoreBreak: boolean;
}

interface INewScheduleValue {
  selectData: IData;
  selectClient: IClient | undefined;
  clients: IClient[] | undefined;
  categories: ICategory[] | undefined;
  services: IService[] | undefined;
  isClient: boolean;
  step: number;
  isValid: boolean;
  handleQueryClient: ({
    search,
    take,
  }: {
    search?: string | undefined;
    take?: number | undefined;
  }) => void;
  handleSelectData: (newData: IDataSelect) => void;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isOpen: boolean;
  handleOpen: () => void;
  createSchedule: () => void;
  isCreate: boolean;
}

const NewScheduleProviderContext = createContext({} as INewScheduleValue);

export function NewScheduleProvider({ children }: { children: React.ReactNode }) {
  const { selectWorkingDay, handleSelectWorkingDayId } = useHome();
  const [queryClient, setQueryClient] = useState({
    search: '',
    take: 5,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [step, setStep] = useState(0);
  const [selectData, setSelectData] = useState<IData>({
    professionalId: 1,
    isIgnoreBreak: false,
  });

  const handleOpen = () => {
    setStep(0);
    setSelectData({ professionalId: 1, isIgnoreBreak: false });
    setIsOpen((old) => !old);
  };

  const isValid = useMemo(() => {
    if (step === 0) {
      return !!selectData.clientId;
    }

    if (step === 1) {
      return !!selectData.categoryId;
    }

    if (step === 2) {
      return !!selectData.serviceId;
    }

    if (step === 4) {
      return !!selectData.startTime;
    }

    return true;
  }, [selectData, step]);

  const {
    data: clients,
    refetch: refetchClients,
    isLoading: isClient,
  } = useQuery({
    queryKey: ['clients', queryClient],
    queryFn: () => ClientService.getAll(queryClient),
    refetchInterval: Infinity,
  });

  const { data: selectClient, refetch: refetchClient } = useQuery({
    initialData: clients?.find((el) => el.id === selectData.clientId),
    queryKey: ['client', selectData.clientId],
    queryFn: () => ClientService.retrieveClient(selectData.clientId!),
    refetchInterval: Infinity,
    enabled: !!selectData.clientId,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAll(),
    refetchInterval: Infinity,
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => ServiceService.getAll(),
    refetchInterval: Infinity,
  });

  const handleQueryClient = useCallback(
    ({ search = '', take = 5 }) => {
      setQueryClient({ search, take });
      refetchClients();
    },
    [refetchClients],
  );

  const handleSelectData = useCallback(
    (newData: IDataSelect) => {
      setSelectData((old) => ({ ...old, ...newData }));
      if (newData.clientId) refetchClient();
    },
    [refetchClient],
  );

  const createSchedule = useCallback(() => {
    setIsCreate(true);
    BookingService.createBooking({
      clientId: selectData.clientId!,
      date: selectData.date!,
      startTime: selectData.startTime!,
      endTime:
        selectData.startTime! +
        selectData.services!.reduce((acc, service) => acc + service.durationMinutes, 0),
      professionalId: selectData.professionalId,
      services: selectData.services!,
      forPersonName: selectData.forPersonName,
    })
      .then(() => {
        handleOpen();
        handleSelectWorkingDayId(selectWorkingDay!.key!);
      })
      .finally(() => setIsCreate(false));
  }, [
    handleSelectWorkingDayId,
    selectData.clientId,
    selectData.date,
    selectData.forPersonName,
    selectData.professionalId,
    selectData.services,
    selectData.startTime,
    selectWorkingDay,
  ]);

  const value = useMemo(
    () => ({
      categories,
      clients,
      handleQueryClient,
      handleSelectData,
      setStep,
      isClient,
      isValid,
      selectClient,
      selectData,
      services,
      step,
      handleOpen,
      isOpen,
      createSchedule,
      isCreate,
    }),
    [
      categories,
      clients,
      createSchedule,
      handleQueryClient,
      handleSelectData,
      isClient,
      isCreate,
      isOpen,
      isValid,
      selectClient,
      selectData,
      services,
      step,
    ],
  );

  return (
    <NewScheduleProviderContext.Provider value={value}>
      {children}
    </NewScheduleProviderContext.Provider>
  );
}

export const useNewSchedule = () => {
  const context = useContext(NewScheduleProviderContext);

  if (context === undefined)
    throw new Error('useNewSchedule must be used within a NewScheduleProvider');

  return context;
};
