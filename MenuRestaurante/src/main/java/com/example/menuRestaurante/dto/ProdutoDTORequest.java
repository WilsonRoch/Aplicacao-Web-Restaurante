package com.example.menuRestaurante.dto;

import com.example.menuRestaurante.model.StatusProduto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record ProdutoDTORequest(
	@NotBlank String nome,
	@NotBlank String descricao,
	@Positive double preco,
	@NotBlank String categoria,
	StatusProduto status,
	@NotBlank String imagem
) {
}
