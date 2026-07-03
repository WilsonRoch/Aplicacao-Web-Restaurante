import type { Produto } from '../models/Produto'

import './CustomerProductCard.css'

interface CustomerProductCardProps {
    produto: Produto
    quantidadeNoCarrinho: number
    onAdd: () => void
    onRemove: () => void
}

export function CustomerProductCard({ produto, quantidadeNoCarrinho, onAdd, onRemove }: CustomerProductCardProps) {
    return (
        <article className="customer-product-card">
            <img className="customer-product-card__image" src={produto.imagem} alt={produto.nome} />

            <div className="customer-product-card__content">
                <div className="customer-product-card__meta">
                    <span className="customer-product-card__tag">{produto.categoria}</span>
                    <span className="customer-product-card__tag customer-product-card__tag--soft">Ativo</span>
                </div>

                <h2 className="customer-product-card__title">{produto.nome}</h2>
                <p className="customer-product-card__description">{produto.descricao}</p>

                <div className="customer-product-card__footer">
                    <strong className="customer-product-card__price">R$ {produto.preco.toFixed(2)}</strong>

                    {quantidadeNoCarrinho > 0 ? (
                        <div className="customer-product-card__quantity">
                            <button type="button" onClick={onRemove} aria-label={`Remover uma unidade de ${produto.nome}`}>
                                -
                            </button>
                            <span>{quantidadeNoCarrinho}</span>
                            <button type="button" onClick={onAdd} aria-label={`Adicionar uma unidade de ${produto.nome}`}>
                                +
                            </button>
                        </div>
                    ) : (
                        <button type="button" className="customer-product-card__button" onClick={onAdd}>
                            Adicionar ao carrinho
                        </button>
                    )}
                </div>
            </div>
        </article>
    )
}