package com.inventory.repository;

import com.inventory.dto.request.SalesRequest;
import com.inventory.dto.response.SalesResponse;

import java.util.List;

public interface SalesRepository {
    SalesResponse save(SalesRequest request);
    SalesResponse findById(int saleId);
    List<SalesResponse> findAll();
    SalesResponse update(int saleId, SalesRequest request);
    boolean delete(int saleId);
}
