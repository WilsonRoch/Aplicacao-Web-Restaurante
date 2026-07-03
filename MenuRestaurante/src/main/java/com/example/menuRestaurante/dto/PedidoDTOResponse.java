package com.example.menuRestaurante.dto;

import com.example.menuRestaurante.model.StatusPedido;
import java.time.OffsetDateTime;
import java.util.List;

public record PedidoDTOResponse(
        Long id,
        List<ItemPedidoDTOResponse> itensPedido,
        double valorTotal,
        StatusPedido status,
        OffsetDateTime dataPedido
) {
}
