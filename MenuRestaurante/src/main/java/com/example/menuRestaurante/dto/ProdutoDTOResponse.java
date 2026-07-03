package com.example.menuRestaurante.dto;

import com.example.menuRestaurante.model.StatusProduto;

public record ProdutoDTOResponse(Long id, String nome, String descricao, double preco, String categoria, StatusProduto status, String imagem) {
}
