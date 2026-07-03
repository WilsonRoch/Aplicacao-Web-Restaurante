package com.example.menuRestaurante.dto;

public record ItemPedidoDTOResponse(
        Long id,
        Long produtoId,
        String produtoNome,
        Integer quantidade,
        double preco
) {
}
