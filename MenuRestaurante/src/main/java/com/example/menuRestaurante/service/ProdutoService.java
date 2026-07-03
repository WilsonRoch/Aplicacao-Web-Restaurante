package com.example.menuRestaurante.service;

import com.example.menuRestaurante.dto.ProdutoDTORequest;
import com.example.menuRestaurante.dto.ProdutoDTOResponse;
import com.example.menuRestaurante.model.Produto;
import com.example.menuRestaurante.model.StatusProduto;
import com.example.menuRestaurante.repository.ItemPedidoRepository;
import com.example.menuRestaurante.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {
    private final ProdutoRepository produtoRepository;
    private final ItemPedidoRepository itemPedidoRepository;


    public ProdutoService(ProdutoRepository produtoRepository, ItemPedidoRepository itemPedidoRepository) {
        this.produtoRepository = produtoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
    }

    private ProdutoDTOResponse toResponse(Produto produto) {
        return new ProdutoDTOResponse(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getCategoria(),
                produto.getStatus(),
                produto.getImagem()
        );
    }

    public String save(ProdutoDTORequest produtoDTO) {
        Produto produto = new Produto();
        produto.setNome(produtoDTO.nome());
        produto.setDescricao(produtoDTO.descricao());
        produto.setPreco(produtoDTO.preco());
        produto.setCategoria(produtoDTO.categoria());
        // se o status não for enviado, considerar ATIVO por padrão
        if (produtoDTO.status() == null) {
            produto.setStatus(StatusProduto.ATIVO);
        } else {
            produto.setStatus(produtoDTO.status());
        }
        produto.setImagem(produtoDTO.imagem());
        
        produtoRepository.save(produto);
        return "Salvo com sucesso!";
    }

    public List<ProdutoDTOResponse> listar() {
        List<Produto> produtos = (List<Produto>) produtoRepository.findAll();
        List<ProdutoDTOResponse> produtoDTOResponses = new ArrayList<>();;
        for(Produto produto : produtos) {
            produtoDTOResponses.add(toResponse(produto));
        }
        return produtoDTOResponses;
    }

    public Optional<ProdutoDTOResponse> buscarPorId(Long id) {
        Optional<Produto> produtoOptional = produtoRepository.findById(id);
        if (produtoOptional.isEmpty()) return Optional.empty();
        return Optional.of(toResponse(produtoOptional.get()));
    }

    public ProdutoDTOResponse atualizar(Long id, ProdutoDTORequest dto) {
        Optional<Produto> produtoOptional = produtoRepository.findById(id);
        if (produtoOptional.isEmpty()) {
            throw new IllegalArgumentException("Produto não encontrado com ID: " + id);
        }
        Produto produto = produtoOptional.get();
        produto.setNome(dto.nome());
        produto.setDescricao(dto.descricao());
        produto.setPreco(dto.preco());
        produto.setCategoria(dto.categoria());
        produto.setStatus(dto.status());
        produto.setImagem(dto.imagem());

        produtoRepository.save(produto);
        return toResponse(produto);
    }

    public String deletar(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado com ID: " + id));

        long totalItensPedido = itemPedidoRepository.countByProduto_Id(id);
        if (totalItensPedido == 0) {
            produtoRepository.deleteById(id);
            return "Produto removido com sucesso!";
        }

        if (produto.getStatus() != StatusProduto.INATIVO) {
            produto.setStatus(StatusProduto.INATIVO);
            produtoRepository.save(produto);
        }

        return "Produto desativado porque possui pedidos vinculados.";
    }
}
