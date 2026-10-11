package com.udea.lab1_arqsw.controller;

import com.udea.lab1_arqsw.DTO.CustomerDTO;
import com.udea.lab1_arqsw.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CustomerController.class)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CustomerService customerService;

    @Test
    void getAllCustomersShouldReturnCustomerList() throws Exception {
        // Given
        CustomerDTO firstCustomer = customer(1L, "111111", "Ana", "Gomez", 500.0);
        CustomerDTO secondCustomer = customer(2L, "222222", "Luis", "Perez", 250.0);
        when(customerService.getAllCustomers()).thenReturn(List.of(firstCustomer, secondCustomer));

        // When / Then
        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].accountNumber").value("111111"))
                .andExpect(jsonPath("$[0].firstName").value("Ana"))
                .andExpect(jsonPath("$[0].lastName").value("Gomez"))
                .andExpect(jsonPath("$[0].balance").value(500.0))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].accountNumber").value("222222"));
    }

    @Test
    void getCustomerByIdShouldReturnExistingCustomer() throws Exception {
        // Given
        CustomerDTO expectedCustomer = customer(1L, "111111", "Ana", "Gomez", 500.0);
        when(customerService.getCustomerById(1L)).thenReturn(expectedCustomer);

        // When / Then
        mockMvc.perform(get("/api/customers/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.accountNumber").value("111111"))
                .andExpect(jsonPath("$.firstName").value("Ana"))
                .andExpect(jsonPath("$.lastName").value("Gomez"))
                .andExpect(jsonPath("$.balance").value(500.0));
    }

    @Test
    void createCustomerShouldReturnCreatedCustomerWhenBalanceIsValid() throws Exception {
        // Given
        CustomerDTO createdCustomer = customer(3L, "333333", "Maria", "Lopez", 750.0);
        when(customerService.createCustomer(org.mockito.ArgumentMatchers.any(CustomerDTO.class)))
                .thenReturn(createdCustomer);

        String requestBody = """
                {
                  "firstName": "Maria",
                  "lastName": "Lopez",
                  "accountNumber": "333333",
                  "balance": 750.0
                }
                """;

        // When / Then
        mockMvc.perform(post("/api/customers")
                        .contentType(APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.accountNumber").value("333333"))
                .andExpect(jsonPath("$.firstName").value("Maria"))
                .andExpect(jsonPath("$.lastName").value("Lopez"))
                .andExpect(jsonPath("$.balance").value(750.0));
    }

    private CustomerDTO customer(
            Long id,
            String accountNumber,
            String firstName,
            String lastName,
            Double balance) {
        return new CustomerDTO(id, firstName, lastName, accountNumber, balance);
    }
}
