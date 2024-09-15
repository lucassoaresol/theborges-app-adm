import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDebounce } from '@/hooks/UseDebounce';
import { ChangeEvent, useState } from 'react';
import { NewClientDialog } from './NewClientDialog';
import { useNewSchedule } from './useNewSchedule';


export function SelectClientDialog() {
  const { debounce } = useDebounce();
  const { handleQueryClient, clients, selectData, handleSelectData, isClient, selectClient, setStep
  } = useNewSchedule();
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState(false);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debounce(() => {
      handleQueryClient({ search: e.target.value });
    });
  };

  return newClient ? <NewClientDialog /> : <div>
    <div className="flex items-center mb-4 gap-2">
      <Input onChange={handleSearch} value={searchTerm} placeholder="Buscar cliente" />
      <Button size='sm' onClick={() => setNewClient(true)}>Novo Cliente</Button>
    </div>

    {!searchTerm && selectClient ? <Button className='w-full mt-1'>
      {`${selectClient.name} - ${selectClient.phone}`}
    </Button> : <>
      {clients && clients.length === 0 && <p>Nenhum cliente encontrado</p>}
      {clients ? clients.map((cl) =>
        <Button key={cl.id}
          variant={selectData.clientId === cl.id ? 'default' : 'outline'}
          className='w-full mt-1'
          onClick={() => { handleSelectData({ clientId: cl.id, name: cl.name, categoryId: undefined, startTime: undefined }); setStep((old) => old + 1); }}>
          {`${cl.name} - ${cl.phone}`}
        </Button>) : isClient && <Skeleton className="h-[40px] w-full rounded-xl" />
      }
    </>}

  </div >;



}
