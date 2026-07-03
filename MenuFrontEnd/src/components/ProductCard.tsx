import type { Produto } from '../models/Produto'

import './ProductCard.css'

interface ProductCardProps {
    produto: Produto
    onEdit: (produto: Produto) => void
    onDelete: (produto: Produto) => void
    onToggleStatus: (produto: Produto) => void
}

export function ProductCard({ produto, onEdit, onDelete, onToggleStatus }: ProductCardProps) {
    const isActive = produto.status === 'ativo'

    return (
        <article className="product-card">
            <div className="product-card__header">
                <span className={`product-card__badge ${isActive ? 'product-card__badge--active' : 'product-card__badge--inactive'}`}>
                    {isActive ? 'Ativo' : 'Inativo'}
                </span>

                <div className="product-card__actions">
                    <button type="button" className="product-card__action" onClick={() => onEdit(produto)}>
                        Editar
                    </button>
                    <button type="button" className="product-card__action" onClick={() => onToggleStatus(produto)}>
                        {isActive ? 'Desativar' : 'Ativar'}
                    </button>
                    <button type="button" className="product-card__action product-card__action--danger" onClick={() => onDelete(produto)}>
                        Excluir
                    </button>
                </div>
            </div>

            <img className="product-card__image" src={produto.imagem} alt={produto.nome} />

            <div className="product-card__content">
                <h2 className="product-card__title">{produto.nome}</h2>
                <p className="product-card__description">{produto.descricao}</p>

                <dl className="product-card__details">
                    <div>
                        <dt>Categoria</dt>
                        <dd>{produto.categoria}</dd>
                    </div>
                    <div>
                        <dt>Preço</dt>
                        <dd>R$ {produto.preco.toFixed(2)}</dd>
                    </div>
                    <div>
                        <dt>Status</dt>
                        <dd>{isActive ? 'Ativo' : 'Inativo'}</dd>
                    </div>
                </dl>
            </div>
        </article>
    )
}