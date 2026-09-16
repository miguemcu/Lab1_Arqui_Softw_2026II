package com.udea.lab1_arqsw.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")

// Constructores y encapsulación con Lombok
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_account_number", nullable = false)
    private String senderAccountNumber;

    @Column(name = "receiver_account_number", nullable = false)
    private String receiverAccountNumber;

    @Column(nullable = false)
    private Double amount;

    private LocalDateTime timestamp = LocalDateTime.now();

}
