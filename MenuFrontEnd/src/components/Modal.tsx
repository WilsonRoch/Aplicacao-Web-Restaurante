// Importa o React (necessário para usar JSX e tipos)
import React from 'react'

// Importa o arquivo CSS que define os estilos do modal
import './Modal.css'

// Define o tipo das propriedades que o componente Modal recebe
interface ModalProps {
    isOpen: boolean        // Define se o modal está visível ou não
    onClose: () => void    // Função que será chamada para fechar o modal
    children: React.ReactNode // Elementos filhos que serão renderizados dentro do modal
}

// Componente funcional Modal
export function Modal({ isOpen, onClose, children }: ModalProps) {
    // Se o modal não estiver aberto (isOpen === false), não renderiza nada (retorna null)
    if (!isOpen) return null

    // Se isOpen for true, renderiza o conteúdo do modal
    return (
        // Div que cobre a tela inteira e escurece o fundo (overlay)
        // Também permite fechar o modal ao clicar fora do conteúdo
        <div className="modal-overlay" onClick={onClose}>
            {/* Div que contém o conteúdo do modal.
                O clique aqui é interrompido para não fechar o modal */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Botão de fechar (X) no canto superior direito */}
                <button className="close-button" onClick={onClose}>×</button>

                {/* Renderiza os componentes filhos dentro do modal */}
                {children}
            </div>
        </div>
    )
}
