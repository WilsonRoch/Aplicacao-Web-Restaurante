import type { PedidoResponse, StatusPedido } from '../models/Pedido'

import './PedidoCard.css'

interface PedidoCardProps {
    pedido: PedidoResponse
    onChangeStatus: (pedido: PedidoResponse, status: StatusPedido) => void
}

const STATUS_LABELS: Record<StatusPedido, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
}

export function PedidoCard({ pedido, onChangeStatus }: PedidoCardProps) {
    return (
        <article className="pedido-card">
            <div className="pedido-card__header">
                <div>
                    <p className="pedido-card__eyebrow">Pedido #{pedido.id}</p>
                    <h3 className="pedido-card__title">{STATUS_LABELS[pedido.status]}</h3>
                </div>

                <strong className="pedido-card__total">R$ {pedido.valorTotal.toFixed(2)}</strong>
            </div>

            <p className="pedido-card__meta">
                {new Date(pedido.dataPedido).toLocaleString('pt-BR')}
            </p>

            <ul className="pedido-card__items">
                {pedido.itensPedido.map((item) => (
                    <li key={item.id}>
                        <div className="pedido-card__produto">
                            {item.quantidade}x {item.produtoNome}
                        </div>

                        <strong>
                            R$ {(item.preco * item.quantidade).toFixed(2)}
                        </strong>
                    </li>
                ))}
            </ul>

            <div className="pedido-card__actions">
                {(['pendente', 'em_andamento', 'concluido', 'cancelado'] as StatusPedido[]).map((status) => (
                    <button
                        key={status}
                        type="button"
                        className={status === pedido.status ? 'pedido-card__button pedido-card__button--active' : 'pedido-card__button'}
                        onClick={() => onChangeStatus(pedido, status)}
                    >
                        {STATUS_LABELS[status]}
                    </button>
                ))}
            </div>
        </article>
    )
}