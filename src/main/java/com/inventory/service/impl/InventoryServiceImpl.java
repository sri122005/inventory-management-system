package com.inventory.service.impl;

import com.inventory.dto.request.InventoryRequest;
import com.inventory.dto.response.InventoryResponse;
import com.inventory.repository.InventoryRepository;
import com.inventory.service.InventoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    public InventoryResponse save(InventoryRequest request) {
        InventoryResponse existing = inventoryRepository.findByProductAndWarehouse(
                request.getProductId(),
                request.getWarehouseId()
        );
        if (existing != null) {
            // Update quantity instead of duplicate insert to honor unique constraints gracefully
            InventoryRequest updateRequest = new InventoryRequest(
                    request.getProductId(),
                    request.getWarehouseId(),
                    existing.getQuantity() + request.getQuantity()
            );
            InventoryResponse updated = inventoryRepository.update(existing.getInventoryId(), updateRequest);
            updated.setMessage("Inventory updated successfully (quantity merged)");
            return updated;
        }

        InventoryResponse saved = inventoryRepository.save(request);
        saved.setMessage("Inventory created successfully");
        return saved;
    }

    @Override
    public InventoryResponse findById(int inventoryId) {
        return inventoryRepository.findById(inventoryId);
    }

    @Override
    public InventoryResponse findByProductAndWarehouse(int productId, int warehouseId) {
        return inventoryRepository.findByProductAndWarehouse(productId, warehouseId);
    }

    @Override
    public List<InventoryResponse> findAll() {
        return inventoryRepository.findAll();
    }

    @Override
    public InventoryResponse update(int inventoryId, InventoryRequest request) {
        InventoryResponse response = inventoryRepository.update(inventoryId, request);
        if (response != null) {
            response.setMessage("Inventory updated successfully");
        }
        return response;
    }

    @Override
    public boolean delete(int inventoryId) {
        return inventoryRepository.delete(inventoryId);
    }
}
