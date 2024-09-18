import { useQuery } from '@tanstack/react-query';

import { CategoryService } from '../services/CategoryService';

export function useCategories() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: CategoryService.getAll,
    refetchInterval: Infinity,
  });

  return { categories: data ?? [], isLoading };
}
