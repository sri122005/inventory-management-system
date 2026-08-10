package com.inventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {
    private int inventoryId;
    private int productId;
    private int warehouseId;
    private int quantity;
    private LocalDateTime lastUpdated;
    private String message;
}
