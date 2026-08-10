package com.inventory.service;

import com.inventory.dto.request.WarehouseRequest;
import com.inventory.dto.response.WarehouseResponse;

import java.util.List;

public interface WarehouseService {

    WarehouseResponse save(WarehouseRequest request);

    WarehouseResponse findById(int warehouseId);

    List<WarehouseResponse> findAll();

    WarehouseResponse update(int warehouseId, WarehouseRequest request);

    boolean delete(int warehouseId);
}