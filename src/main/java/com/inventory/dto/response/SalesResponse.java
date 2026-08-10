package com.inventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesResponse {
    private int saleId;
    private int productId;
    private int warehouseId;
    private int quantity;
    private BigDecimal sellingPrice;
    private LocalDateTime saleDate;
    private String message;
}
