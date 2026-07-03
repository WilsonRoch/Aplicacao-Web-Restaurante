import { useQuery } from '@tanstack/react-query'

import type { PedidoResponse } from '../models/Pedido'
import { api } from '../services/api'

export const pedidosQueryKey = ['pedidos'] as const

export function usePedidosQuery() {
    return useQuery<PedidoResponse[]>({
        queryKey: pedidosQueryKey,
        queryFn: async () => {
            const response = await api.get('/pedido')
            return response.data
        },
    })
}