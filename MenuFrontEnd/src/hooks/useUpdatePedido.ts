import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { PedidoResponse, PedidoUpdateInput } from '../models/Pedido'
import { api } from '../services/api'
import { pedidosQueryKey } from './usePedidos'

type UpdatePedidoInput = {
    id: number
    pedido: PedidoUpdateInput
}

export function useUpdatePedido() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, pedido }: UpdatePedidoInput) => {
            const response = await api.put<PedidoResponse>(`/pedido/${id}`, pedido)
            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: pedidosQueryKey })
        },
    })
}