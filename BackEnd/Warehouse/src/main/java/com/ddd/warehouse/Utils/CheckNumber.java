package com.ddd.warehouse.Utils;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CheckNumber {
    public static boolean IsLessThanOrEqualZero(BigDecimal number) {
        return number.compareTo(BigDecimal.ZERO) <= 0;
    }
}
