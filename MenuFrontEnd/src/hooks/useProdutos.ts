import { useQuery } from '@tanstack/react-query'

import type { Produto } from '../models/Produto'
import { api } from '../services/api'

export const produtosQueryKey = ['produtos'] as const

export function useProdutosQuery() {
    return useQuery<Produto[]>({
        queryKey: produtosQueryKey,
        queryFn: async () => {
            const response = await api.get('/produto')
            return response.data
        },
    })
}