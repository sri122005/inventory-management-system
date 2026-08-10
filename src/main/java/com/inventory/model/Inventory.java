package com.inventory.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    private int inventoryId;
    private int productId;
    private int warehouseId;
    private int quantity;
    private LocalDateTime lastUpdated;
}
