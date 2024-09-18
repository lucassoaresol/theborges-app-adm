import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { IClient } from '../entities/IClient';
import { ClientService } from '../services/ClientService';

export function useClients() {
  const queryClient = useQueryClient();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['clients'],
    queryFn: ({ pageParam = 0 }) => ClientService.getAll({ pageParam, limit: 20 }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length * 20 : undefined, // Se ainda houver mais clientes, retorna o próximo valor
    initialPageParam: 0,
  });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ClientService.create,
    onSuccess: (newClient) => {
      // Atualiza o cache da lista de clientes automaticamente
      queryClient.setQueryData(['clients'], (oldData: any) => {
        if (!oldData || !oldData.pages) return null;

        // Adiciona o novo cliente à primeira página de dados
        return {
          ...oldData,
          pages: oldData.pages.map(
            (
              page: {
                result: IClient[];
                hasMore: boolean;
              },
              index: number,
            ) =>
              index === 0 ? { ...page, result: [newClient, ...page.result] } : page,
          ),
        };
      });
    },
  });

  return {
    clients: data ? data.pages.flatMap((page) => page.result) : [],
    create: mutate,
    createLoading: isPending,
    createError: isError,
  };
}
