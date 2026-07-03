import { useMemo, useState } from 'react'

import { Modal } from '../components/Modal'
import { PedidoCard } from '../components/PedidoCard'
import { ProductForm } from '../components/ProductForm'
import { ProductList } from '../components/ProductList'
import { usePedidosQuery } from '../hooks/usePedidos'
import type { Produto } from '../models/Produto'
import type { PedidoResponse, StatusPedido } from '../models/Pedido'
import { useCreateProduto } from '../hooks/useCreateProduto'
import { useDeleteProduto } from '../hooks/useDeleteProduto'
import { useProdutosQuery } from '../hooks/useProdutos'
import { useUpdateProduto } from '../hooks/useUpdateProduto'
import { useUpdatePedido } from '../hooks/useUpdatePedido'

import './MenuPage.css'

const PEDIDO_COLUNAS = [
    { status: 'pendente' as const, titulo: 'Pendentes' },
    { status: 'em_andamento' as const, titulo: 'Em andamento' },
    { status: 'concluido' as const, titulo: 'Concluídos' },
    { status: 'cancelado' as const, titulo: 'Cancelados' },
]

export function MenuPage() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null)
    const [feedback, setFeedback] = useState<string | null>(null)

    const produtosQuery = useProdutosQuery()
    const pedidosQuery = usePedidosQuery()
    const createProduto = useCreateProduto()
    const updateProduto = useUpdateProduto()
    const deleteProduto = useDeleteProduto()
    const updatePedido = useUpdatePedido()

    const pedidosOrdenados = useMemo(
        () => [...(pedidosQuery.data ?? [])].sort((a, b) => Number(new Date(b.dataPedido)) - Number(new Date(a.dataPedido))),
        [pedidosQuery.data],
    )

    const pedidosPorStatus = useMemo(
        () => ({
            pendente: pedidosOrdenados.filter((pedido) => pedido.status === 'pendente'),
            em_andamento: pedidosOrdenados.filter((pedido) => pedido.status === 'em_andamento'),
            concluido: pedidosOrdenados.filter((pedido) => pedido.status === 'concluido'),
            cancelado: pedidosOrdenados.filter((pedido) => pedido.status === 'cancelado'),
        }),
        [pedidosOrdenados],
    )

    const isEditing = editingProduto !== null

    function closeForm() {
        setIsFormOpen(false)
        setEditingProduto(null)
    }

    async function handleCreateProduto(produto: Omit<Produto, 'id'>) {
        setFeedback(null)

        try {
            await createProduto.mutateAsync(produto)
            setIsFormOpen(false)
            setFeedback('Produto cadastrado com sucesso.')
        } catch {
            setFeedback('Não foi possível cadastrar o produto.')
            throw new Error('Falha ao cadastrar produto')
        }
    }

    async function handleUpdateProduto(produto: Omit<Produto, 'id'>) {
        if (!editingProduto) {
            return
        }

        setFeedback(null)

        try {
            await updateProduto.mutateAsync({ id: editingProduto.id, produto })
            closeForm()
            setFeedback('Produto atualizado com sucesso.')
        } catch {
            setFeedback('Não foi possível atualizar o produto.')
            throw new Error('Falha ao atualizar produto')
        }
    }

    async function handleDeleteProduto(produto: Produto) {
        console.log("DADOS DO PRODUTO RECEBIDOS:", produto);
        const confirmed = window.confirm(`Excluir o produto "${produto.nome}"?`)

        if (!confirmed) {
            return
        }

        setFeedback(null)

        try {
            await deleteProduto.mutateAsync(produto.id)
            setFeedback('Produto removido do menu com sucesso.')
        } catch {
            setFeedback('Não foi possível excluir o produto.')
        }
    }

    async function handleToggleStatus(produto: Produto) {
        setFeedback(null)
        const status = produto.status === 'ativo' ? 'inativo' : 'ativo'

        try {
            await updateProduto.mutateAsync({
                id: produto.id,
                produto: {
                    nome: produto.nome,
                    descricao: produto.descricao,
                    preco: produto.preco,
                    imagem: produto.imagem,
                    categoria: produto.categoria,
                    status,
                },
            })

            setFeedback(produto.status === 'ativo' ? 'Produto desativado.' : 'Produto ativado.')
        } catch {
            setFeedback('Não foi possível alterar o status do produto.')
        }
    }

    async function handleUpdatePedidoStatus(pedido: PedidoResponse, status: StatusPedido) {
        setFeedback(null)

        try {
            await updatePedido.mutateAsync({
                id: pedido.id,
                pedido: {
                    itensPedido: pedido.itensPedido.map((item) => ({
                        produtoId: item.produtoId,
                        quantidade: item.quantidade,
                    })),
                    status,
                    dataPedido: pedido.dataPedido,
                    dataEntrega: pedido.dataEntrega,
                },
            })

            setFeedback(`Pedido #${pedido.id} atualizado para ${status}.`)
        } catch {
            setFeedback(`Não foi possível atualizar o pedido #${pedido.id}.`)
        }
    }

    return (
        <main className="menu-page">
            <section className="menu-page__hero">
                <div>
                    <p className="menu-page__eyebrow">Administração de Cardápio e Gerenciamento de Pedidos</p>
                    <h1>ADMINISTRAÇÃO</h1>
                    <p className="menu-page__subtitle">
                        Menu dedicado a admnistração do restaurante.
                    </p>
                </div>

                <button
                    className="menu-page__action"
                    type="button"
                    onClick={() => {
                        setEditingProduto(null)
                        setIsFormOpen(true)
                    }}
                >
                    Novo Produto
                </button>
            </section>

            {feedback && <p className="menu-page__feedback">{feedback}</p>}

            <section className="menu-page__panel">
                <div className="menu-page__panel-head">
                    <div>
                        <p className="menu-page__eyebrow">Pedidos</p>
                        <h2>Pedidos recentes</h2>
                    </div>
                </div>

                {pedidosQuery.isLoading && <p className="menu-page__status">Carregando pedidos...</p>}
                {pedidosQuery.isError && <p className="menu-page__status menu-page__status--error">Erro ao carregar os pedidos.</p>}
                {!pedidosQuery.isLoading && !pedidosQuery.isError && pedidosOrdenados.length === 0 && (
                    <p className="menu-page__status">Nenhum pedido encontrado.</p>
                )}

                <div className="orders-board">
                    {PEDIDO_COLUNAS.map((coluna) => (
                        <div key={coluna.status} className="orders-column">
                            <h3>
                                {coluna.titulo}
                                <span>{pedidosPorStatus[coluna.status].length}</span>
                            </h3>

                            {pedidosPorStatus[coluna.status].map((pedido) => (
                                <PedidoCard key={pedido.id} pedido={pedido} onChangeStatus={handleUpdatePedidoStatus} />
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            <ProductList
                produtos={produtosQuery.data ?? []}
                isLoading={produtosQuery.isLoading}
                isError={produtosQuery.isError}
                onEdit={(produto) => {
                    setEditingProduto(produto)
                    setIsFormOpen(true)
                }}
                onDelete={handleDeleteProduto}
                onToggleStatus={handleToggleStatus}
            />

            <Modal isOpen={isFormOpen} onClose={closeForm}>
                <ProductForm
                    initialValues={editingProduto}
                    onSubmit={isEditing ? handleUpdateProduto : handleCreateProduto}
                    onCancel={closeForm}
                    isSubmitting={createProduto.isPending || updateProduto.isPending}
                    title={isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                    submitLabel={isEditing ? 'Salvar alterações' : 'Cadastrar'}
                />
            </Modal>
        </main>
    )
}