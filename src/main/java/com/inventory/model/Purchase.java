package com.inventory.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {
    private int purchaseId;
    private int supplierId;
    private int productId;
    private int warehouseId;
    private int quantity;
    private BigDecimal purchasePrice;
    private LocalDateTime purchaseDate;
}
