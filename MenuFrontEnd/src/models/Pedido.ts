export type StatusPedido = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado'

export type ItemPedidoInput = {
    produtoId: number
    quantidade: number
}

export type PedidoCreateInput = {
    itensPedido: ItemPedidoInput[]
    status: StatusPedido
    dataPedido: string
}

export type ItemPedidoResponse = {
    id: number
    produtoId: number
    produtoNome: string
    quantidade: number
    preco: number
}

export type PedidoResponse = {
    id: number
    itensPedido: ItemPedidoResponse[]
    valorTotal: number
    status: StatusPedido
    dataPedido: string
    dataEntrega: string | null
}

export type PedidoUpdateInput = {
    itensPedido: ItemPedidoInput[]
    status: StatusPedido
    dataPedido: string
    dataEntrega?: string | null
}