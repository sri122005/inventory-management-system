package com.inventory.repository;

import com.inventory.dto.request.InventoryRequest;
import com.inventory.dto.response.InventoryResponse;

import java.util.List;

public interface InventoryRepository {
    InventoryResponse save(InventoryRequest request);
    InventoryResponse findById(int inventoryId);
    InventoryResponse findByProductAndWarehouse(int productId, int warehouseId);
    List<InventoryResponse> findAll();
    InventoryResponse update(int inventoryId, InventoryRequest request);
    boolean delete(int inventoryId);
}
