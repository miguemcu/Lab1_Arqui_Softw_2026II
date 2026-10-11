package com.udea.lab1_arqsw.mapper;

import com.udea.lab1_arqsw.DTO.CustomerDTO;
import com.udea.lab1_arqsw.entity.Customer;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.assertj.core.api.Assertions.assertThat;

class CustomerMapperTest {

    private final CustomerMapper customerMapper = Mappers.getMapper(CustomerMapper.class);

    @Test
    void toDTOShouldMapEveryCustomerField() {
        // Given
        Customer customer = new Customer(7L, "123456", "Ana", "Gomez", 850.75);

        // When
        CustomerDTO result = customerMapper.toDTO(customer);

        // Then
        assertThat(result.getId()).isEqualTo(7L);
        assertThat(result.getFirstName()).isEqualTo("Ana");
        assertThat(result.getLastName()).isEqualTo("Gomez");
        assertThat(result.getAccountNumber()).isEqualTo("123456");
        assertThat(result.getBalance()).isEqualTo(850.75);
    }

    @Test
    void toEntityShouldMapEveryCustomerDtoField() {
        // Given
        CustomerDTO customerDTO = new CustomerDTO(8L, "Luis", "Perez", "654321", 425.50);

        // When
        Customer result = customerMapper.toEntity(customerDTO);

        // Then
        assertThat(result.getId()).isEqualTo(8L);
        assertThat(result.getFirstName()).isEqualTo("Luis");
        assertThat(result.getLastName()).isEqualTo("Perez");
        assertThat(result.getAccountNumber()).isEqualTo("654321");
        assertThat(result.getBalance()).isEqualTo(425.50);
    }

    @Test
    void customerDtoSettersShouldUpdateEveryField() {
        // Given
        CustomerDTO customerDTO = new CustomerDTO(null, null, null, null, null);

        // When
        customerDTO.setId(9L);
        customerDTO.setFirstName("Sofia");
        customerDTO.setLastName("Ramirez");
        customerDTO.setAccountNumber("987654");
        customerDTO.setBalance(1200.0);

        // Then
        assertThat(customerDTO.getId()).isEqualTo(9L);
        assertThat(customerDTO.getFirstName()).isEqualTo("Sofia");
        assertThat(customerDTO.getLastName()).isEqualTo("Ramirez");
        assertThat(customerDTO.getAccountNumber()).isEqualTo("987654");
        assertThat(customerDTO.getBalance()).isEqualTo(1200.0);
    }
}
