package com.udea.lab1_arqsw.service;

import com.udea.lab1_arqsw.DTO.CustomerDTO;
import com.udea.lab1_arqsw.entity.Customer;
import com.udea.lab1_arqsw.mapper.CustomerMapper;
import com.udea.lab1_arqsw.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toDTO).toList();
    }

    public CustomerDTO getCustomerById(Long id) {
        return customerRepository.findById(id).map(customerMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer = customerMapper.toEntity(customerDTO);
        return customerMapper.toDTO(customerRepository.save(customer));
    }
}
