package com.inventory.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    private String productName;
    private String sku;
    private String barcode;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private int minimumStock;
    private int categoryId;
    private int supplierId;
    private boolean status;
}