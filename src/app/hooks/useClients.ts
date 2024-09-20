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
      lastPage.hasMore ? pages.length * 20 : undefined,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const {
    mutate: create,
    isPending: createLoading,
    isError: createError,
  } = useMutation({
    mutationFn: ClientService.create,
    onSuccess: (newClient) => {
      queryClient.setQueryData(['clients'], (oldData: any) => {
        if (!oldData || !oldData.pages) return null;

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

  const { mutate: update, isPending: updateLoading } = useMutation({
    mutationFn: ClientService.update,
    onSuccess: (updatedClient) => {
      queryClient.setQueryData(['clients'], (oldData: any) => {
        if (!oldData || !oldData.pages) return null;

        return {
          ...oldData,
          pages: oldData.pages.map((page: { result: IClient[] }) => ({
            ...page,
            result: page.result.map((client) =>
              client.id === updatedClient.id ? updatedClient : client,
            ),
          })),
        };
      });
    },
  });

  return {
    clients: data ? data.pages.flatMap((page) => page.result) : [],
    create,
    createLoading,
    createError,
    update,
    updateLoading,
  };
}
