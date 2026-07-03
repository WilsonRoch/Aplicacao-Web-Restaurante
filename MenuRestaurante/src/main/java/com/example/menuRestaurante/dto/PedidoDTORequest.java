package com.example.menuRestaurante.dto;

import com.example.menuRestaurante.model.StatusPedido;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.List;

public record PedidoDTORequest(
        @NotNull(message = "itensPedido é obrigatório")
        @JsonAlias({"itensPedido"})
        List<ItemPedidoDTORequest> itensPedido,

        @NotNull(message = "status é obrigatório")
        @JsonAlias({"status"})
        StatusPedido status,

        @NotNull(message = "dataPedido é obrigatório")
        @JsonAlias({"dataPedido"})
        OffsetDateTime dataPedido
) {
}
