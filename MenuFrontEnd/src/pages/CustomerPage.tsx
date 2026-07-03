import { useEffect, useMemo, useState } from 'react'

import { CustomerProductCard } from '../components/CustomerProductCard'
import { useCreatePedido } from '../hooks/useCreatePedido'
import { useProdutosQuery } from '../hooks/useProdutos'
import type { PedidoCreateInput } from '../models/Pedido'
import type { Produto } from '../models/Produto'

import './CustomerPage.css'

type CartItem = {
    produto: Produto
    quantidade: number
}

const CART_STORAGE_KEY = 'menu-stream-cart'

function loadCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined') {
        return []
    }

    try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY)
        if (!raw) {
            return []
        }

        const parsed = JSON.parse(raw) as CartItem[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export function CustomerPage() {
    const produtosQuery = useProdutosQuery()
    const createPedido = useCreatePedido()
    const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCartFromStorage())
    const [feedback, setFeedback] = useState<string | null>(null)

    useEffect(() => {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    }, [cartItems])

    const produtosDisponiveis = useMemo(
        () => (produtosQuery.data ?? []).filter((produto) => produto.status === 'ativo'),
        [produtosQuery.data],
    )

    const subtotal = cartItems.reduce((total, item) => total + item.produto.preco * item.quantidade, 0)
    const total = subtotal

    function addProduto(produto: Produto) {
        setFeedback(null)
        setCartItems((current) => {
            const existing = current.find((item) => item.produto.id === produto.id)

            if (existing) {
                return current.map((item) =>
                    item.produto.id === produto.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item,
                )
            }

            return [...current, { produto, quantidade: 1 }]
        })
    }

    function removeProduto(produtoId: number) {
        setFeedback(null)
        setCartItems((current) =>
            current
                .map((item) =>
                    item.produto.id === produtoId ? { ...item, quantidade: item.quantidade - 1 } : item,
                )
                .filter((item) => item.quantidade > 0),
        )
    }

    function clearCart() {
        setCartItems([])
    }

    async function handleFinalizarPedido() {
        if (cartItems.length === 0) {
            setFeedback('Adicione ao menos um item ao carrinho.')
            return
        }

        const payload: PedidoCreateInput = {
            itensPedido: cartItems.map((item) => ({
                produtoId: item.produto.id,
                quantidade: item.quantidade,
            })),
            status: 'pendente',
            dataPedido: new Date().toISOString(),
        }

        setFeedback(null)

        try {
            const pedido = await createPedido.mutateAsync(payload)
            clearCart()
            setFeedback(`Pedido #${pedido.id} enviado com sucesso.`)
        } catch {
            setFeedback('Não foi possível finalizar o pedido.')
        }
    }

    return (
        <main className="customer-page">
            <section className="customer-page__hero">
                <div>
                    <p className="customer-page__eyebrow">Área do cliente</p>
                    <h1>Monte seu pedido</h1>
                </div>

                <div className="customer-page__hero-card">
                    <span>Itens no carrinho</span>
                    <strong>{cartItems.reduce((total, item) => total + item.quantidade, 0)}</strong>
                </div>
            </section>

            {feedback && <p className="customer-page__feedback">{feedback}</p>}

            <div className="customer-page__layout">
                <section>
                    <div className="customer-page__section-head">
                        <h2>Cardápio</h2>
                        <p>{produtosDisponiveis.length} produtos disponíveis</p>
                    </div>

                    {produtosQuery.isLoading && <p className="customer-page__status">Carregando cardápio...</p>}
                    {produtosQuery.isError && <p className="customer-page__status customer-page__status--error">Erro ao carregar os produtos.</p>}
                    {!produtosQuery.isLoading && !produtosQuery.isError && produtosDisponiveis.length === 0 && (
                        <p className="customer-page__status">Nenhum produto ativo disponível no momento.</p>
                    )}

                    <div className="customer-page__grid">
                        {produtosDisponiveis.map((produto) => {
                            const itemCarrinho = cartItems.find((item) => item.produto.id === produto.id)

                            return (
                                <CustomerProductCard
                                    key={produto.id}
                                    produto={produto}
                                    quantidadeNoCarrinho={itemCarrinho?.quantidade ?? 0}
                                    onAdd={() => addProduto(produto)}
                                    onRemove={() => removeProduto(produto.id)}
                                />
                            )
                        })}
                    </div>
                </section>

                <aside className="customer-page__cart">
                    <div className="customer-page__section-head">
                        <h2>Carrinho</h2>
                        <p>{cartItems.length} itens diferentes</p>
                    </div>

                    {cartItems.length === 0 ? (
                        <p className="customer-page__status">Seu carrinho está vazio.</p>
                    ) : (
                        <>
                            <ul className="customer-page__cart-list">
                                {cartItems.map((item) => (
                                    <li key={item.produto.id} className="customer-page__cart-item">
                                        <div>
                                            <strong>{item.produto.nome}</strong>
                                            <p>
                                                {item.quantidade} x R$ {item.produto.preco.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="customer-page__cart-actions">
                                            <button type="button" onClick={() => removeProduto(item.produto.id)}>
                                                -
                                            </button>
                                            <button type="button" onClick={() => addProduto(item.produto)}>
                                                +
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <dl className="customer-page__totals">
                                <div>
                                    <dt>Subtotal</dt>
                                    <dd>R$ {subtotal.toFixed(2)}</dd>
                                </div>
                                <div className="customer-page__totals--highlight">
                                    <dt>Total</dt>
                                    <dd>R$ {total.toFixed(2)}</dd>
                                </div>
                            </dl>

                            <div className="customer-page__cart-actions-row">
                                <button type="button" className="customer-page__secondary" onClick={clearCart} disabled={createPedido.isPending}>
                                    Limpar carrinho
                                </button>
                                <button type="button" className="customer-page__primary" onClick={handleFinalizarPedido} disabled={createPedido.isPending}>
                                    {createPedido.isPending ? 'Finalizando...' : 'Finalizar pedido'}
                                </button>
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </main>
    )
}