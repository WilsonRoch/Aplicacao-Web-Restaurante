import { useMutation } from '@tanstack/react-query'

import type { PedidoCreateInput, PedidoResponse } from '../models/Pedido'
import { api } from '../services/api'

export function useCreatePedido() {
    return useMutation({
        mutationFn: async (novoPedido: PedidoCreateInput) => {
            const response = await api.post<PedidoResponse>('/pedido', novoPedido)
            return response.data
        },
    })
}