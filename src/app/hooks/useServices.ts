import { useQuery } from '@tanstack/react-query';

import { ServiceService } from '../services/ServiceService';

export function useServices() {
  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: ServiceService.getAll,
    refetchInterval: Infinity,
  });

  return { services: data ?? [], isLoading };
}
