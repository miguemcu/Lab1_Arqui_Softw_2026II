package com.udea.lab1_arqsw.mapper;

import com.udea.lab1_arqsw.DTO.TransactionDTO;
import com.udea.lab1_arqsw.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TransactionMapper {
    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);
    TransactionDTO toDTO(Transaction transaction);
}
