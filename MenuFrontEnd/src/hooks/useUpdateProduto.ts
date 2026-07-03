import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Produto } from '../models/Produto'
import { api } from '../services/api'
import { produtosQueryKey } from './useProdutos'

type UpdateProdutoInput = {
    id: number
    produto: Omit<Produto, 'id'>
}

export function useUpdateProduto() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, produto }: UpdateProdutoInput) => {
            const response = await api.put(`/produto/${id}`, produto)
            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: produtosQueryKey })
        },
    })
}