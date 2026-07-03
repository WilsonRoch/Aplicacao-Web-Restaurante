export type StatusProduto = 'ativo' | 'inativo'

// src/models/Produto.ts
export type Produto = {
    id: number
    nome: string
    descricao: string
    preco: number
    imagem: string
    categoria: string
    status: StatusProduto
}
