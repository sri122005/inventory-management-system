package com.inventory.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class product {

    private int productId;
    private String productName;
    private String sku;
    private String barcode;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private int minimumStock;
    private int categoryId;
    private int supplierId;
    private boolean status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}