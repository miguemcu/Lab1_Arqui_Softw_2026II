package com.udea.lab1_arqsw.service;

import com.udea.lab1_arqsw.DTO.CustomerDTO;
import com.udea.lab1_arqsw.entity.Customer;
import com.udea.lab1_arqsw.mapper.CustomerMapper;
import com.udea.lab1_arqsw.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerMapper customerMapper;

    @InjectMocks
    private CustomerService customerService;

    @Test
    void getAllCustomersShouldReturnMappedCustomers() {
        // Given
        Customer firstCustomer = customer(1L, "111");
        Customer secondCustomer = customer(2L, "222");
        CustomerDTO firstDto = customerDto(1L, "111");
        CustomerDTO secondDto = customerDto(2L, "222");
        when(customerRepository.findAll()).thenReturn(List.of(firstCustomer, secondCustomer));
        when(customerMapper.toDTO(firstCustomer)).thenReturn(firstDto);
        when(customerMapper.toDTO(secondCustomer)).thenReturn(secondDto);

        // When
        List<CustomerDTO> result = customerService.getAllCustomers();

        // Then
        assertThat(result).containsExactly(firstDto, secondDto);
        verify(customerRepository).findAll();
        verify(customerMapper).toDTO(firstCustomer);
        verify(customerMapper).toDTO(secondCustomer);
    }

    @Test
    void getCustomerByIdShouldReturnMappedCustomerWhenItExists() {
        // Given
        Customer customer = customer(1L, "111");
        CustomerDTO expectedDto = customerDto(1L, "111");
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(customerMapper.toDTO(customer)).thenReturn(expectedDto);

        // When
        CustomerDTO result = customerService.getCustomerById(1L);

        // Then
        assertThat(result).isSameAs(expectedDto);
        verify(customerMapper).toDTO(customer);
    }

    @Test
    void getCustomerByIdShouldThrowWhenCustomerDoesNotExist() {
        // Given
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> customerService.getCustomerById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Customer not found");
    }

    @Test
    void createCustomerShouldMapSaveAndReturnCustomerDto() {
        // Given
        CustomerDTO request = customerDto(null, "111");
        Customer entity = customer(1L, "111");
        CustomerDTO expectedDto = customerDto(1L, "111");
        when(customerMapper.toEntity(request)).thenReturn(entity);
        when(customerRepository.save(entity)).thenReturn(entity);
        when(customerMapper.toDTO(entity)).thenReturn(expectedDto);

        // When
        CustomerDTO result = customerService.createCustomer(request);

        // Then
        assertThat(result).isSameAs(expectedDto);
        verify(customerMapper).toEntity(request);
        verify(customerRepository).save(entity);
        verify(customerMapper).toDTO(entity);
    }

    private Customer customer(Long id, String accountNumber) {
        return new Customer(id, accountNumber, "First", "Last", 100.0);
    }

    private CustomerDTO customerDto(Long id, String accountNumber) {
        return new CustomerDTO(id, "First", "Last", accountNumber, 100.0);
    }
}
