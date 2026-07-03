package com.example.menuRestaurante.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum StatusProduto {
    ATIVO,
    INATIVO;

    @JsonCreator
    public static StatusProduto fromJson(String value) {
        if (value == null) {
            return null;
        }

        return StatusProduto.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }

    @JsonValue
    public String toJson() {
        return name().toLowerCase(Locale.ROOT);
    }
}
