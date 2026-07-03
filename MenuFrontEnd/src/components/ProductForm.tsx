import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import type { Produto, StatusProduto } from '../models/Produto'
import "../components/ProductForm.css"

interface ProductFormProps {
    initialValues?: Omit<Produto, 'id'> | null
    onSubmit: (produto: Omit<Produto, 'id'>) => Promise<void> | void
    onCancel: () => void
    isSubmitting?: boolean
    title?: string
    submitLabel?: string
}

type ProductFormData = {
    nome: string
    descricao: string
    preco: string
    imagem: string
    categoria: string
    status: StatusProduto
}

const initialFormData: ProductFormData = {
    nome: '',
    descricao: '',
    preco: '',
    imagem: '',
    categoria: '',
    status: 'ativo',
}

function buildFormData(values?: Omit<Produto, 'id'> | null): ProductFormData {
    if (!values) {
        return initialFormData
    }

    return {
        nome: values.nome,
        descricao: values.descricao,
        preco: String(values.preco),
        imagem: values.imagem,
        categoria: values.categoria,
        status: values.status,
    }
}

export function ProductForm({
    initialValues = null,
    onSubmit,
    onCancel,
    isSubmitting = false,
    title = 'Cadastrar Novo Produto',
    submitLabel = 'Cadastrar',
}: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>(initialFormData)

    useEffect(() => {
        setFormData(buildFormData(initialValues))
    }, [initialValues])

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const target = e.currentTarget
        const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value
        setFormData((prev) => ({
            ...prev,
            [target.name]: target.name === 'status' ? (value as StatusProduto) : value,
        }))
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        try {
            await onSubmit({
                nome: formData.nome,
                descricao: formData.descricao,
                preco: Number(formData.preco),
                imagem: formData.imagem,
                categoria: formData.categoria,
                status: formData.status,
            })

            setFormData(initialFormData)
        } catch {
            // O erro é tratado no container da página.
        }
    }

    return (
        <form className="formProduto" onSubmit={handleSubmit}>
            <h2>{title}</h2>

            <fieldset className="formProduto__fields" disabled={isSubmitting}>
                <label>
                    Nome
                    <input name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
                </label>

                <label>
                    Descrição
                    <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} required rows={4} />
                </label>

                <label>
                    Link da imagem
                    <input name="imagem" placeholder="URL da imagem" value={formData.imagem} onChange={handleChange} required />
                </label>

                <label>
                    Categoria
                    <input name="categoria" placeholder="Categoria" value={formData.categoria} onChange={handleChange} required />
                </label>

                <label>
                    Preço
                    <input name="preco" type="number" min="0" step="0.01" placeholder="Preço" value={formData.preco} onChange={handleChange} required />
                </label>

                <label>
                    Status
                    <select name="status" value={formData.status} onChange={handleChange} required>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </label>
            </fieldset>

            <div className="formProduto__actions">
                <button type="button" className="formProduto__secondary" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className="formProduto__primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : submitLabel}
                </button>
            </div>
        </form>
    )
}
