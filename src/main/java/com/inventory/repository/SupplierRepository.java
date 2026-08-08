package com.inventory.repository;

import com.inventory.dto.request.SupplierRequest;
import com.inventory.dto.response.SupplierResponse;

import java.util.List;

public interface SupplierRepository {
    SupplierResponse save(SupplierRequest request);
    SupplierResponse findById(int supplierId);
    List<SupplierResponse> findAll();
    SupplierResponse update(int supplierId,SupplierRequest request);
    boolean delete(int supplierId);
}
