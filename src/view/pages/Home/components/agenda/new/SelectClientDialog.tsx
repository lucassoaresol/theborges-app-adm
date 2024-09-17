import { ChangeEvent, useState } from 'react';

import { useDebounce } from '@/app/hooks/useDebounce';
import { Button } from '@/view/components/ui/Button';
import { Input } from '@/view/components/ui/Input';
import { Skeleton } from '@/view/components/ui/Skeleton';

import { NewClientDialog } from './NewClientDialog';
import { useNewSchedule } from './useNewSchedule';

export function SelectClientDialog() {
  const { debounce } = useDebounce();
  const {
    handleQueryClient,
    clients,
    selectData,
    handleSelectData,
    isClient,
    selectClient,
    setStep,
  } = useNewSchedule();
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState(false);

  const isPhoneNumber = (value: string | undefined): boolean => {
    if (!value) return false;

    const phonePattern = /^(\+?\d{1,3})?\s?\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    return phonePattern.test(value);
  };

  const getOnlyNumbers = (value: string): string => value.replace(/\D/g, ''); // Remove tudo que não for número
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    let search = e.target.value;
    setSearchTerm(search);
    debounce(() => {
      if (isPhoneNumber(search)) {
        search = getOnlyNumbers(search);
      }
      handleQueryClient({ search });
    });
  };

  return newClient ? (
    <NewClientDialog />
  ) : (
    <div>
      <div className="flex items-center mb-4 gap-2">
        <Input
          onChange={handleSearch}
          value={searchTerm}
          placeholder="Buscar cliente"
        />
        <Button size="sm" onClick={() => setNewClient(true)}>
          Novo Cliente
        </Button>
      </div>

      {!searchTerm && selectClient ? (
        <Button className="w-full mt-1">
          {`${selectClient.name} - ${selectClient.phone}`}
        </Button>
      ) : (
        <>
          {clients && clients.length === 0 && <p>Nenhum cliente encontrado</p>}
          {clients
            ? clients.map((cl) => (
                <Button
                  key={cl.id}
                  variant={selectData.clientId === cl.id ? 'default' : 'outline'}
                  className="w-full mt-1"
                  onClick={() => {
                    handleSelectData({
                      clientId: cl.id,
                      name: cl.name,
                      categoryId: undefined,
                      startTime: undefined,
                    });
                    setStep((old) => old + 1);
                  }}
                >
                  {`${cl.name} - ${cl.phone}`}
                </Button>
              ))
            : isClient && <Skeleton className="h-[40px] w-full rounded-xl" />}
        </>
      )}
    </div>
  );
}
