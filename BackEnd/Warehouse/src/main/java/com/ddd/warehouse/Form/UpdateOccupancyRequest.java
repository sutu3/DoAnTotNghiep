package com.ddd.warehouse.Form;

import java.math.BigDecimal;

public record UpdateOccupancyRequest(
        BigDecimal occupancyChange
) {
}
