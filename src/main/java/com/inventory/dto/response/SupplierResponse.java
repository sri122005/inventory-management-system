package com.inventory.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierResponse {
    private int supplierId;
    private String supplierName;
    private String contactPerson;
    private String phone;
    private String email;
    private String address;
    private String gstNumber;
    private boolean status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
