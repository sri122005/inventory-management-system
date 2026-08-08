package com.inventory.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierRequest {
    private String supplierName;
    private String contactPerson;
    private String phone;
    private String email;
    private String address;
    private String gstNumber;
    private boolean status;
}
