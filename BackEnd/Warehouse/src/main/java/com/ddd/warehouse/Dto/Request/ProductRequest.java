package com.ddd.warehouse.Dto.Request;

import com.ddd.warehouse.Module.Category;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductRequest (
    String skuCode,
    String productName,
    BigDecimal productPrice,
    String description,
    String category
){
}
