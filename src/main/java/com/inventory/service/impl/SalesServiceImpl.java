package com.inventory.service.impl;

import com.inventory.dto.request.InventoryRequest;
import com.inventory.dto.request.SalesRequest;
import com.inventory.dto.response.InventoryResponse;
import com.inventory.dto.response.SalesResponse;
import com.inventory.repository.SalesRepository;
import com.inventory.service.InventoryService;
import com.inventory.service.SalesService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SalesServiceImpl implements SalesService {

    private final SalesRepository salesRepository;
    private final InventoryService inventoryService;

    public SalesServiceImpl(SalesRepository salesRepository, InventoryService inventoryService) {
        this.salesRepository = salesRepository;
        this.inventoryService = inventoryService;
    }

    @Override
    @Transactional
    public SalesResponse save(SalesRequest request) {
        // Validate stock availability
        InventoryResponse existing = inventoryService.findByProductAndWarehouse(
                request.getProductId(),
                request.getWarehouseId()
        );
        int available = existing != null ? existing.getQuantity() : 0;
        if (available < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock in warehouse for product! Available: " + available + ", requested: " + request.getQuantity());
        }

        SalesResponse saved = salesRepository.save(request);

        // Deduct quantity from inventory
        updateInventoryQuantity(request.getProductId(), request.getWarehouseId(), -request.getQuantity());

        saved.setMessage("Sale recorded successfully and stock updated");
        return saved;
    }

    @Override
    public SalesResponse findById(int saleId) {
        return salesRepository.findById(saleId);
    }

    @Override
    public List<SalesResponse> findAll() {
        return salesRepository.findAll();
    }

    @Override
    @Transactional
    public SalesResponse update(int saleId, SalesRequest request) {
        SalesResponse oldSale = salesRepository.findById(saleId);
        if (oldSale == null) {
            return null;
        }

        // Adjust inventory levels for changes (validates stock as well)
        adjustInventoryForUpdate(oldSale, request);

        SalesResponse updated = salesRepository.update(saleId, request);
        if (updated != null) {
            updated.setMessage("Sale updated successfully and stock adjusted");
        }
        return updated;
    }

    @Override
    @Transactional
    public boolean delete(int saleId) {
        SalesResponse oldSale = salesRepository.findById(saleId);
        if (oldSale == null) {
            return false;
        }

        // Restore quantity to inventory
        updateInventoryQuantity(oldSale.getProductId(), oldSale.getWarehouseId(), oldSale.getQuantity());

        return salesRepository.delete(saleId);
    }

    private void adjustInventoryForUpdate(SalesResponse oldS, SalesRequest newS) {
        if (oldS.getProductId() == newS.getProductId() && oldS.getWarehouseId() == newS.getWarehouseId()) {
            int diff = newS.getQuantity() - oldS.getQuantity();
            if (diff != 0) {
                InventoryResponse inv = inventoryService.findByProductAndWarehouse(newS.getProductId(), newS.getWarehouseId());
                int available = inv != null ? inv.getQuantity() : 0;
                if (diff > 0 && available < diff) {
                    throw new RuntimeException("Insufficient stock in warehouse. Available: " + available + ", required extra: " + diff);
                }
                updateInventoryQuantity(newS.getProductId(), newS.getWarehouseId(), -diff);
            }
        } else {
            InventoryResponse newInv = inventoryService.findByProductAndWarehouse(newS.getProductId(), newS.getWarehouseId());
            int available = newInv != null ? newInv.getQuantity() : 0;
            if (available < newS.getQuantity()) {
                throw new RuntimeException("Insufficient stock in new warehouse. Available: " + available + ", required: " + newS.getQuantity());
            }
            // Restore old quantity to old warehouse/product
            updateInventoryQuantity(oldS.getProductId(), oldS.getWarehouseId(), oldS.getQuantity());
            // Deduct new quantity from new warehouse/product
            updateInventoryQuantity(newS.getProductId(), newS.getWarehouseId(), -newS.getQuantity());
        }
    }

    private void updateInventoryQuantity(int productId, int warehouseId, int delta) {
        InventoryResponse existing = inventoryService.findByProductAndWarehouse(productId, warehouseId);
        if (existing != null) {
            InventoryRequest updateReq = new InventoryRequest(
                    productId,
                    warehouseId,
                    existing.getQuantity() + delta
            );
            inventoryService.update(existing.getInventoryId(), updateReq);
        } else {
            if (delta < 0) {
                throw new RuntimeException("No inventory record found for product " + productId + " in warehouse " + warehouseId);
            } else {
                InventoryRequest insertReq = new InventoryRequest(
                        productId,
                        warehouseId,
                        delta
                );
                inventoryService.save(insertReq);
            }
        }
    }
}
