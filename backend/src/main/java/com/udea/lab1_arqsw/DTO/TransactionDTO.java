package com.udea.lab1_arqsw.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

// Lombok
@NoArgsConstructor
@AllArgsConstructor
@Data

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionDTO {

    private Long id;
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private Double amount;
    private LocalDateTime timestamp;
}
