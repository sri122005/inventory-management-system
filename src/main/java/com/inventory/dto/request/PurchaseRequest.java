package com.inventory.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRequest {
    private int supplierId;
    private int productId;
    private int warehouseId;
    private int quantity;
    private BigDecimal purchasePrice;
    private LocalDateTime purchaseDate;
}
