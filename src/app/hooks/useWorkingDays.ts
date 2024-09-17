import { useQuery } from '@tanstack/react-query';

import { WorkingDaysService } from '../services/WorkingDaysService';

export function useWorkingDays() {
  const { data, isLoading } = useQuery({
    queryKey: ['WorkingDays'],
    queryFn: WorkingDaysService.getAll,
    refetchInterval: 300000,
  });

  return { workingDays: data ?? [], isLoading };
}
