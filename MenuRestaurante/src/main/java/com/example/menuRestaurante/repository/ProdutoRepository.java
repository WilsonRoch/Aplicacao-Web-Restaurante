package com.example.menuRestaurante.repository;

import com.example.menuRestaurante.model.Produto;
import org.springframework.data.repository.CrudRepository;

public interface ProdutoRepository extends CrudRepository<Produto, Long> {
}
