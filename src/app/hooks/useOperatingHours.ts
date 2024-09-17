import { useQuery } from '@tanstack/react-query';

import { OperatingHoursService } from '../services/OperatingHoursService';

export function useOperatingHours() {
  const { data } = useQuery({
    queryKey: ['operatingHours'],
    queryFn: OperatingHoursService.getAll,
    staleTime: Infinity,
  });

  return { operatingHours: data ?? [] };
}
