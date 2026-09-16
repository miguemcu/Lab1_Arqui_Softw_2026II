package com.udea.lab1_arqsw.controller;

import com.udea.lab1_arqsw.DTO.TransactionDTO;
import com.udea.lab1_arqsw.DTO.TransferRequestDTO;
import com.udea.lab1_arqsw.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/* (CORS) Autorización para que el front (en la ruta
"http://localhost:8080") consulte al back   */
@CrossOrigin(origins = "http://localhost:8080")

@RestController
@RequestMapping(value="/api/transactions", produces = "application/json") // Mimetype de JSON
public class TransactionController {

    @Autowired
    private TransactionService transactionService;


    @PostMapping
    public ResponseEntity<?> transferMoney(@RequestBody TransferRequestDTO transferRequestDTO) {
        try {
            TransactionDTO savedTransaction = transactionService.transferMoney(transferRequestDTO);
            return ResponseEntity.ok(savedTransaction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{accountNumber}")
    public List<TransactionDTO> getTransactionsByAccount(@PathVariable String accountNumber) {
        return transactionService.getTransactionsForAccount(accountNumber);
    }
}
