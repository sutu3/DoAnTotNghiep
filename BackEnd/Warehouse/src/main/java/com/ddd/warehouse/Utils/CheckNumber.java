package com.ddd.warehouse.Utils;

import org.springframework.stereotype.Component;

@Component
public class CheckNumber {
    public static boolean IsLessThanOrEqualZero(int number) {
        return number <= 0;
    }
}
