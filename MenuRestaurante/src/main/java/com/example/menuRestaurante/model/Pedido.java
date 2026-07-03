package com.example.menuRestaurante.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itensPedido;

    @Column(nullable = false)
    private double valorTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status;

    @Column(nullable = false)
    private LocalDateTime dataPedido;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<ItemPedido> getItensPedido() {
        return itensPedido;
    }

    public void setItensPedido(List<ItemPedido> itensPedido) {
        this.itensPedido = itensPedido;
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }

    public LocalDateTime getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(LocalDateTime dataPedido) {
        this.dataPedido = dataPedido;
    }

    public Pedido() {
    }

    public Pedido(List<ItemPedido> itensPedido, double valorTotal, StatusPedido status, LocalDateTime dataPedido) {
        this.itensPedido = itensPedido;
        this.valorTotal = valorTotal;
        this.status = status;
        this.dataPedido = dataPedido;
    }

    public Pedido(Long id, List<ItemPedido> itensPedido, double valorTotal, StatusPedido status, LocalDateTime dataPedido) {
        this.id = id;
        this.itensPedido = itensPedido;
        this.valorTotal = valorTotal;
        this.status = status;
        this.dataPedido = dataPedido;
    }

    @Override
    public String toString() {
        return "Pedido{" +
                "id=" + id +
                ", itensPedido=" + itensPedido +
                ", valorTotal=" + valorTotal +
                ", status=" + status +
                ", dataPedido=" + dataPedido +
                '}';
    }
}
