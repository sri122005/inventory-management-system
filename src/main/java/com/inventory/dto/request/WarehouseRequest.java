package com.inventory.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseRequest {

    private String warehouseName;
    private String location;
    private int capacity;
    private String managerName;
    private String phone;
    private String email;
    private boolean status;
}