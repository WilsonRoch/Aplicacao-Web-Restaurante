package com.example.menuRestaurante.repository;

import com.example.menuRestaurante.model.Pedido;
import org.springframework.data.repository.CrudRepository;

public interface PedidoRepository extends CrudRepository<Pedido, Long> {
    boolean existsById(Long id);
}
