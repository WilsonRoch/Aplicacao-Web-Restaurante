package com.example.menuRestaurante.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ItemPedidoDTORequest(
        @NotNull(message = "produtoId é obrigatório")
        @JsonAlias({"produtoId"})
        Long produtoId,

        @NotNull(message = "quantidade é obrigatória")
        @Positive(message = "quantidade deve ser maior que zero")
        @JsonAlias({"quantidade"})
        Integer quantidade
) {
}
