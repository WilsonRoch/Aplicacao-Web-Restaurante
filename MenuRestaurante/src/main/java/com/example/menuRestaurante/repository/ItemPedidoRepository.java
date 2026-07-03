package com.example.menuRestaurante.repository;

import com.example.menuRestaurante.model.ItemPedido;
import org.springframework.data.repository.CrudRepository;

public interface ItemPedidoRepository extends CrudRepository<ItemPedido, Long> {
	long countByProduto_Id(Long produtoId);
}
