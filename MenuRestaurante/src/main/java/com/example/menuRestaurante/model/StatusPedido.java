package com.example.menuRestaurante.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum StatusPedido {
    PENDENTE,
    EM_ANDAMENTO,
    CONCLUIDO,
    CANCELADO;

    @JsonCreator
    public static StatusPedido fromJson(String value) {
        if (value == null) {
            return null;
        }

        return StatusPedido.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }

    @JsonValue
    public String toJson() {
        return name().toLowerCase(Locale.ROOT);
    }
}
