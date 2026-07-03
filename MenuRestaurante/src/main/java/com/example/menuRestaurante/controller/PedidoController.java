package com.example.menuRestaurante.controller;

import com.example.menuRestaurante.dto.PedidoDTORequest;
import com.example.menuRestaurante.dto.PedidoDTOResponse;
import com.example.menuRestaurante.model.Pedido;
import com.example.menuRestaurante.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pedido")
@CrossOrigin(origins = "*")
public class PedidoController {
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<?> salvar(@Valid @RequestBody PedidoDTORequest pedidoDTO) {
        try {
            Pedido pedido = pedidoService.save(pedidoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.buscarPorId(pedido.getId()).orElseThrow());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<PedidoDTOResponse>> listar() {
        List<PedidoDTOResponse> pedidos = pedidoService.listar();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        Optional<PedidoDTOResponse> pedido = pedidoService.buscarPorId(id);
        if (pedido.isPresent()) {
            return ResponseEntity.ok(pedido.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pedido não encontrado");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            pedidoService.deletar(id);
            return ResponseEntity.ok("Deletado com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody PedidoDTORequest pedidoDTO) {
        try {
            Pedido pedidoAtualizado = pedidoService.atualizar(id, pedidoDTO);
            return ResponseEntity.ok(pedidoService.buscarPorId(pedidoAtualizado.getId()).orElseThrow());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
