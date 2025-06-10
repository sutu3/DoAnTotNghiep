package com.ddd.warehouse.Form;



import jakarta.persistence.Column;
import lombok.Builder;

import java.time.LocalDateTime;
@Builder
public record AddressForm (
        String address,
        String street,
        String district,
        String country
){
}
