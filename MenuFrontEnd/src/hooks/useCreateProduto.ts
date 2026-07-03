import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Produto } from '../models/Produto'
import { api } from '../services/api'
import { produtosQueryKey } from './useProdutos'

export function useCreateProduto() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (novoProduto: Omit<Produto, 'id'>) => {
            const response = await api.post('/produto', novoProduto)
            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: produtosQueryKey })
        },
    })
}