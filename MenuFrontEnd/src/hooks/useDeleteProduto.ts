import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../services/api'
import { produtosQueryKey } from './useProdutos'

export function useDeleteProduto() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete(`/produto/${id}`)
            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: produtosQueryKey })
        },
    })
}