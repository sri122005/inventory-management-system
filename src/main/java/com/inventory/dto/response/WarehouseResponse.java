package com.inventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseResponse {

    private int warehouseId;
    private String warehouseName;
    private String location;
    private int capacity;
    private String managerName;
    private String phone;
    private String email;
    private boolean status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}