package com.example.menuRestaurante.controller;

import com.example.menuRestaurante.dto.ProdutoDTORequest;
import jakarta.validation.Valid;
import com.example.menuRestaurante.dto.ProdutoDTOResponse;
import com.example.menuRestaurante.service.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/produto")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @PostMapping
    public ResponseEntity<String> salvar(@Valid @RequestBody ProdutoDTORequest produtoDTO) {
        String resp = produtoService.save(produtoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping
    public List<ProdutoDTOResponse> listar(){
        return produtoService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Optional<ProdutoDTOResponse> produtoOpcional = produtoService.buscarPorId(id);

        if (produtoOpcional.isPresent()) {
            return ResponseEntity.ok(produtoOpcional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id){
        try {
            produtoService.deletar(id);
            return ResponseEntity.ok("Deletado com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoDTORequest produtoDTO){
        try {
            var atualizado = produtoService.atualizar(id, produtoDTO);
            return ResponseEntity.ok(produtoService.buscarPorId(id).orElseThrow());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
