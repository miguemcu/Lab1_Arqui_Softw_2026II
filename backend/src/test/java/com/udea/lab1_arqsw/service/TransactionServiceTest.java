package com.udea.lab1_arqsw.service;

import com.udea.lab1_arqsw.DTO.TransactionDTO;
import com.udea.lab1_arqsw.DTO.TransferRequestDTO;
import com.udea.lab1_arqsw.entity.Customer;
import com.udea.lab1_arqsw.entity.Transaction;
import com.udea.lab1_arqsw.repository.CustomerRepository;
import com.udea.lab1_arqsw.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private TransactionService transactionService;

    @Test
    void transferMoneyShouldUpdateBalancesSaveTransactionAndReturnDto() {
        // Given
        Customer sender = customer("111", 500.0);
        Customer receiver = customer("222", 100.0);
        TransferRequestDTO request = new TransferRequestDTO("111", "222", 150.0);
        when(customerRepository.findByAccountNumber("111")).thenReturn(Optional.of(sender));
        when(customerRepository.findByAccountNumber("222")).thenReturn(Optional.of(receiver));
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        TransactionDTO result = transactionService.transferMoney(request);

        // Then
        ArgumentCaptor<Customer> customerCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository, org.mockito.Mockito.times(2)).save(customerCaptor.capture());
        assertThat(customerCaptor.getAllValues()).containsExactly(sender, receiver);
        assertThat(sender.getBalance()).isEqualTo(350.0);
        assertThat(receiver.getBalance()).isEqualTo(250.0);

        ArgumentCaptor<Transaction> transactionCaptor = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepository).save(transactionCaptor.capture());
        Transaction savedTransaction = transactionCaptor.getValue();
        assertThat(savedTransaction.getSenderAccountNumber()).isEqualTo("111");
        assertThat(savedTransaction.getReceiverAccountNumber()).isEqualTo("222");
        assertThat(savedTransaction.getAmount()).isEqualTo(150.0);
        assertThat(savedTransaction.getTimestamp()).isNotNull();

        assertThat(result.getId()).isNull();
        assertThat(result.getSenderAccountNumber()).isEqualTo("111");
        assertThat(result.getReceiverAccountNumber()).isEqualTo("222");
        assertThat(result.getAmount()).isEqualTo(150.0);
        assertThat(result.getTimestamp()).isEqualTo(savedTransaction.getTimestamp());
    }

    @Test
    void transferMoneyShouldRejectNullSenderAccount() {
        // Given
        TransferRequestDTO request = new TransferRequestDTO(null, "222", 150.0);

        // When / Then
        assertThatThrownBy(() -> transactionService.transferMoney(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Los números de cuenta del remitente y receptor son obligatorios.");
    }

    @Test
    void transferMoneyShouldRejectNullReceiverAccount() {
        // Given
        TransferRequestDTO request = new TransferRequestDTO("111", null, 150.0);

        // When / Then
        assertThatThrownBy(() -> transactionService.transferMoney(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Los números de cuenta del remitente y receptor son obligatorios.");
    }

    @Test
    void transferMoneyShouldRejectNonexistentSender() {
        // Given
        TransferRequestDTO request = new TransferRequestDTO("111", "222", 150.0);
        when(customerRepository.findByAccountNumber("111")).thenReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> transactionService.transferMoney(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("La cuenta del remitente no existe.");
    }

    @Test
    void transferMoneyShouldRejectNonexistentReceiver() {
        // Given
        TransferRequestDTO request = new TransferRequestDTO("111", "222", 150.0);
        when(customerRepository.findByAccountNumber("111"))
                .thenReturn(Optional.of(customer("111", 500.0)));
        when(customerRepository.findByAccountNumber("222")).thenReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> transactionService.transferMoney(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("La cuenta del receptor no existe.");
    }

    @Test
    void transferMoneyShouldRejectInsufficientBalanceWithoutSaving() {
        // Given
        TransferRequestDTO request = new TransferRequestDTO("111", "222", 150.0);
        when(customerRepository.findByAccountNumber("111"))
                .thenReturn(Optional.of(customer("111", 100.0)));
        when(customerRepository.findByAccountNumber("222"))
                .thenReturn(Optional.of(customer("222", 200.0)));

        // When / Then
        assertThatThrownBy(() -> transactionService.transferMoney(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Saldo insuficiente en la cuenta del remitente.");
        verify(customerRepository, never()).save(any(Customer.class));
        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    @Test
    void transferMoneyShouldAllowBalanceExactlyEqualToAmount() {
        // Given
        Customer sender = customer("111", 150.0);
        Customer receiver = customer("222", 100.0);
        TransferRequestDTO request = new TransferRequestDTO("111", "222", 150.0);
        when(customerRepository.findByAccountNumber("111")).thenReturn(Optional.of(sender));
        when(customerRepository.findByAccountNumber("222")).thenReturn(Optional.of(receiver));
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        TransactionDTO result = transactionService.transferMoney(request);

        // Then
        assertThat(sender.getBalance()).isZero();
        assertThat(receiver.getBalance()).isEqualTo(250.0);
        assertThat(result.getAmount()).isEqualTo(150.0);
        verify(customerRepository, org.mockito.Mockito.times(2)).save(any(Customer.class));
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void getTransactionsForAccountShouldReturnMappedTransactions() {
        // Given
        LocalDateTime timestamp = LocalDateTime.of(2026, 10, 10, 22, 0);
        Transaction transaction = transaction(7L, "111", "222", 150.0, timestamp);
        when(transactionRepository.findBySenderAccountNumberOrReceiverAccountNumber("111", "111"))
                .thenReturn(List.of(transaction));

        // When
        List<TransactionDTO> result = transactionService.getTransactionsForAccount("111");

        // Then
        assertThat(result).singleElement().satisfies(dto -> {
            assertThat(dto.getId()).isEqualTo(7L);
            assertThat(dto.getSenderAccountNumber()).isEqualTo("111");
            assertThat(dto.getReceiverAccountNumber()).isEqualTo("222");
            assertThat(dto.getAmount()).isEqualTo(150.0);
            assertThat(dto.getTimestamp()).isEqualTo(timestamp);
        });
        verify(transactionRepository)
                .findBySenderAccountNumberOrReceiverAccountNumber("111", "111");
    }

    @Test
    void getTransactionsForAccountShouldReturnEmptyListWhenThereAreNoTransactions() {
        // Given
        when(transactionRepository.findBySenderAccountNumberOrReceiverAccountNumber("999", "999"))
                .thenReturn(List.of());

        // When
        List<TransactionDTO> result = transactionService.getTransactionsForAccount("999");

        // Then
        assertThat(result).isEmpty();
    }

    private Customer customer(String accountNumber, double balance) {
        return new Customer(null, accountNumber, "First", "Last", balance);
    }

    private Transaction transaction(
            Long id,
            String senderAccountNumber,
            String receiverAccountNumber,
            double amount,
            LocalDateTime timestamp) {
        Transaction transaction = new Transaction();
        transaction.setId(id);
        transaction.setSenderAccountNumber(senderAccountNumber);
        transaction.setReceiverAccountNumber(receiverAccountNumber);
        transaction.setAmount(amount);
        transaction.setTimestamp(timestamp);
        return transaction;
    }
}
