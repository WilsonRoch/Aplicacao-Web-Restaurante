import type { Produto } from '../models/Produto'

import { ProductCard } from './ProductCard'

import './ProductList.css'

interface ProductListProps {
    produtos: Produto[]
    isLoading: boolean
    isError: boolean
    onEdit: (produto: Produto) => void
    onDelete: (produto: Produto) => void
    onToggleStatus: (produto: Produto) => void
}

export function ProductList({ produtos, isLoading, isError, onEdit, onDelete, onToggleStatus }: ProductListProps) {
    if (isLoading) return <p className="product-list__status">Carregando cardápio...</p>
    if (isError) return <p className="product-list__status product-list__status--error">Erro ao carregar os produtos.</p>
    if (produtos.length === 0) return <p className="product-list__status">Nenhum produto cadastrado.</p>

    return (
        <section className="product-list">
            {produtos.map((produto) => (
                <ProductCard
                    key={produto.id}
                    produto={produto}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                />
            ))}
        </section>
    )
}
