package com.udea.lab1_arqsw.controller;

import com.udea.lab1_arqsw.DTO.TransactionDTO;
import com.udea.lab1_arqsw.service.TransactionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TransactionController.class)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TransactionService transactionService;

    @Test
    void transferMoneyShouldReturnSavedTransaction() throws Exception {
        // Given
        LocalDateTime timestamp = LocalDateTime.of(2026, 10, 10, 23, 0);
        TransactionDTO savedTransaction =
                new TransactionDTO(1L, "111111", "222222", 150.0, timestamp);
        when(transactionService.transferMoney(any())).thenReturn(savedTransaction);

        String requestBody = """
                {
                  "senderAccountNumber": "111111",
                  "receiverAccountNumber": "222222",
                  "amount": 150.0
                }
                """;

        // When / Then
        mockMvc.perform(post("/api/transactions")
                        .contentType(APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.senderAccountNumber").value("111111"))
                .andExpect(jsonPath("$.receiverAccountNumber").value("222222"))
                .andExpect(jsonPath("$.amount").value(150.0))
                .andExpect(jsonPath("$.timestamp").value("2026-10-10T23:00:00"));
    }

    @Test
    void transferMoneyShouldReturnBadRequestWhenServiceRejectsTransfer() throws Exception {
        // Given
        when(transactionService.transferMoney(any()))
                .thenThrow(new IllegalArgumentException("Saldo insuficiente en la cuenta del remitente."));

        String requestBody = """
                {
                  "senderAccountNumber": "111111",
                  "receiverAccountNumber": "222222",
                  "amount": 150.0
                }
                """;

        // When / Then
        mockMvc.perform(post("/api/transactions")
                        .contentType(APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Saldo insuficiente en la cuenta del remitente."));
    }

    @Test
    void getTransactionsByAccountShouldReturnTransactionList() throws Exception {
        // Given
        LocalDateTime timestamp = LocalDateTime.of(2026, 10, 10, 23, 0);
        TransactionDTO transaction =
                new TransactionDTO(1L, "111111", "222222", 150.0, timestamp);
        when(transactionService.getTransactionsForAccount("111111")).thenReturn(List.of(transaction));

        // When / Then
        mockMvc.perform(get("/api/transactions/{accountNumber}", "111111"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].senderAccountNumber").value("111111"))
                .andExpect(jsonPath("$[0].receiverAccountNumber").value("222222"))
                .andExpect(jsonPath("$[0].amount").value(150.0))
                .andExpect(jsonPath("$[0].timestamp").value("2026-10-10T23:00:00"));
    }
}
