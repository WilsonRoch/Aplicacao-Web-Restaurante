package com.example.menuRestaurante.service;

import com.example.menuRestaurante.dto.ItemPedidoDTORequest;
import com.example.menuRestaurante.dto.ItemPedidoDTOResponse;
import com.example.menuRestaurante.dto.PedidoDTORequest;
import com.example.menuRestaurante.dto.PedidoDTOResponse;
import com.example.menuRestaurante.model.ItemPedido;
import com.example.menuRestaurante.model.Pedido;
import com.example.menuRestaurante.model.Produto;
import com.example.menuRestaurante.repository.PedidoRepository;
import com.example.menuRestaurante.repository.ProdutoRepository;
import com.example.menuRestaurante.model.StatusProduto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.ZoneOffset;

@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository, ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public Pedido save(PedidoDTORequest pedidoDTO) {
        Pedido pedido = new Pedido();
        pedido.setStatus(pedidoDTO.status());
        pedido.setDataPedido(pedidoDTO.dataPedido().toLocalDateTime());

        List<ItemPedido> itensPedido = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (ItemPedidoDTORequest itemDTO : pedidoDTO.itensPedido()) {
            Optional<Produto> produtoOptional = produtoRepository.findById(itemDTO.produtoId());
            if (produtoOptional.isEmpty()) {
                throw new IllegalArgumentException("Produto não encontrado com ID: " + itemDTO.produtoId());
            }

            Produto produto = produtoOptional.get();
            if (produto.getStatus() == StatusProduto.INATIVO) {
                throw new IllegalArgumentException("Produto não disponível: " + produto.getNome());
            }

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(itemDTO.quantidade());

            itensPedido.add(item);
            subtotal = subtotal.add(BigDecimal.valueOf(produto.getPreco())
                    .multiply(BigDecimal.valueOf(itemDTO.quantidade())));
        }

        pedido.setItensPedido(itensPedido);
        pedido.setValorTotal(subtotal.setScale(2, RoundingMode.HALF_UP).doubleValue());

        return pedidoRepository.save(pedido);
    }

    public List<PedidoDTOResponse> listar() {
        List<Pedido> pedidos = (List<Pedido>) pedidoRepository.findAll();
        List<PedidoDTOResponse> pedidoDTOResponses = new ArrayList<>();

        for (Pedido pedido : pedidos) {
            List<ItemPedidoDTOResponse> itensResponse = new ArrayList<>();
            for (ItemPedido item : pedido.getItensPedido()) {
                itensResponse.add(new ItemPedidoDTOResponse(
                        item.getId(),
                        item.getProduto().getId(),
                        item.getProduto().getNome(),
                        item.getQuantidade(),
                        item.getProduto().getPreco()
                ));
            }

            pedidoDTOResponses.add(new PedidoDTOResponse(
                    pedido.getId(),
                    itensResponse,
                    pedido.getValorTotal(),
                    pedido.getStatus(),
                    pedido.getDataPedido().atOffset(ZoneOffset.UTC)
            ));
        }

        return pedidoDTOResponses;
    }

    public Optional<PedidoDTOResponse> buscarPorId(Long id) {
        Optional<Pedido> pedidoOptional = pedidoRepository.findById(id);

        if (pedidoOptional.isEmpty()) {
            return Optional.empty();
        }

        Pedido pedido = pedidoOptional.get();
        List<ItemPedidoDTOResponse> itensResponse = new ArrayList<>();
        for (ItemPedido item : pedido.getItensPedido()) {
            itensResponse.add(new ItemPedidoDTOResponse(
                    item.getId(),
                    item.getProduto().getId(),
                    item.getProduto().getNome(),
                    item.getQuantidade(),
                    item.getProduto().getPreco()
            ));
        }

        return Optional.of(new PedidoDTOResponse(
                pedido.getId(),
                itensResponse,
                pedido.getValorTotal(),
                pedido.getStatus(),
            pedido.getDataPedido().atOffset(ZoneOffset.UTC)
        ));
    }

    public void deletar(Long id) {
        if (!pedidoRepository.existsById(id)) {
            throw new IllegalArgumentException("Pedido não encontrado com ID: " + id);
        }
        pedidoRepository.deleteById(id);
    }

    public Pedido atualizar(Long id, PedidoDTORequest pedidoDTO) {
        Optional<Pedido> pedidoOptional = pedidoRepository.findById(id);
        if (pedidoOptional.isEmpty()) {
            throw new IllegalArgumentException("Pedido não encontrado com ID: " + id);
        }

        Pedido pedidoAtualizado = pedidoOptional.get();
        pedidoAtualizado.setStatus(pedidoDTO.status());
        pedidoAtualizado.setDataPedido(pedidoDTO.dataPedido().toLocalDateTime());

        List<ItemPedido> itensAtualizados = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (ItemPedidoDTORequest itemDTO : pedidoDTO.itensPedido()) {
            Produto produto = produtoRepository.findById(itemDTO.produtoId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado com ID: " + itemDTO.produtoId()));

            if (produto.getStatus() == StatusProduto.INATIVO) {
                throw new IllegalArgumentException("Produto não disponível: " + produto.getNome());
            }

            ItemPedido item = new ItemPedido();
            item.setPedido(pedidoAtualizado);
            item.setProduto(produto);
            item.setQuantidade(itemDTO.quantidade());
            itensAtualizados.add(item);

            subtotal = subtotal.add(BigDecimal.valueOf(produto.getPreco())
                    .multiply(BigDecimal.valueOf(itemDTO.quantidade())));
        }

        pedidoAtualizado.getItensPedido().clear();
        pedidoAtualizado.getItensPedido().addAll(itensAtualizados);
        pedidoAtualizado.setValorTotal(subtotal.setScale(2, RoundingMode.HALF_UP).doubleValue());

        return pedidoRepository.save(pedidoAtualizado);
    }
}
