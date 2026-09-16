package com.udea.lab1_arqsw.service;

import com.udea.lab1_arqsw.DTO.TransactionDTO;
import com.udea.lab1_arqsw.DTO.TransferRequestDTO;
import com.udea.lab1_arqsw.entity.Customer;
import com.udea.lab1_arqsw.entity.Transaction;
import com.udea.lab1_arqsw.repository.CustomerRepository;
import com.udea.lab1_arqsw.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CustomerRepository customerRepository; // Para validar cuentas

    public TransactionDTO transferMoney(TransferRequestDTO transferRequestDTO) {
        // Validar que los números de cuenta no sean nulos
        if (transferRequestDTO.getSenderAccountNumber() == null || transferRequestDTO.getReceiverAccountNumber() == null) {
            throw new IllegalArgumentException("Los números de cuenta del remitente y receptor son obligatorios.");
        }

        // Buscar los clientes por número de cuenta
        Customer sender = customerRepository.findByAccountNumber(transferRequestDTO.getSenderAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("La cuenta del remitente no existe."));
        Customer receiver = customerRepository.findByAccountNumber(transferRequestDTO.getReceiverAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("La cuenta del receptor no existe."));
//    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));
        // Validar que el remitente tenga saldo suficiente
        if (sender.getBalance() < transferRequestDTO.getAmount()) {
            throw new IllegalArgumentException("Saldo insuficiente en la cuenta del remitente.");
            //throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance");
        }

        // Realizar la transferencia
        sender.setBalance(sender.getBalance() - transferRequestDTO.getAmount());
        receiver.setBalance(receiver.getBalance() + transferRequestDTO.getAmount());

        // Guardar los cambios en las cuentas
        customerRepository.save(sender);
        customerRepository.save(receiver);


        // Crear y guardar la transacción
        Transaction transaction = new Transaction();
        transaction.setSenderAccountNumber(sender.getAccountNumber());
        transaction.setReceiverAccountNumber(receiver.getAccountNumber());
        transaction.setAmount(transferRequestDTO.getAmount());
        transaction.setTimestamp(LocalDateTime.now());

        transaction = transactionRepository.save(transaction);

        // Devolver la transacción creada como DTO
        TransactionDTO savedTransaction = new TransactionDTO();
        savedTransaction.setId(transaction.getId());
        savedTransaction.setSenderAccountNumber(transaction.getSenderAccountNumber());
        savedTransaction.setReceiverAccountNumber(transaction.getReceiverAccountNumber());
        savedTransaction.setAmount(transaction.getAmount());
        savedTransaction.setTimestamp(transaction.getTimestamp());

        return savedTransaction;
    }

    public List<TransactionDTO> getTransactionsForAccount(String accountNumber) {
        List<Transaction> transactions = transactionRepository.findBySenderAccountNumberOrReceiverAccountNumber(accountNumber, accountNumber);
        return transactions.stream().map(transaction -> {
            TransactionDTO dto = new TransactionDTO();
            dto.setId(transaction.getId());
            dto.setSenderAccountNumber(transaction.getSenderAccountNumber());
            dto.setReceiverAccountNumber(transaction.getReceiverAccountNumber());
            dto.setAmount(transaction.getAmount());
            dto.setTimestamp(transaction.getTimestamp());
            return dto;
        }).collect(Collectors.toList());
    }
}