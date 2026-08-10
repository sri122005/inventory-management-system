package com.inventory.service.impl;

import com.inventory.dto.request.InventoryRequest;
import com.inventory.dto.request.PurchaseRequest;
import com.inventory.dto.response.InventoryResponse;
import com.inventory.dto.response.PurchaseResponse;
import com.inventory.repository.PurchaseRepository;
import com.inventory.service.InventoryService;
import com.inventory.service.PurchaseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final InventoryService inventoryService;

    public PurchaseServiceImpl(PurchaseRepository purchaseRepository, InventoryService inventoryService) {
        this.purchaseRepository = purchaseRepository;
        this.inventoryService = inventoryService;
    }

    @Override
    @Transactional
    public PurchaseResponse save(PurchaseRequest request) {
        PurchaseResponse saved = purchaseRepository.save(request);

        // Adjust inventory: add quantity to target product/warehouse
        updateInventoryQuantity(request.getProductId(), request.getWarehouseId(), request.getQuantity());

        saved.setMessage("Purchase recorded successfully and stock updated");
        return saved;
    }

    @Override
    public PurchaseResponse findById(int purchaseId) {
        return purchaseRepository.findById(purchaseId);
    }

    @Override
    public List<PurchaseResponse> findAll() {
        return purchaseRepository.findAll();
    }

    @Override
    @Transactional
    public PurchaseResponse update(int purchaseId, PurchaseRequest request) {
        PurchaseResponse oldPurchase = purchaseRepository.findById(purchaseId);
        if (oldPurchase == null) {
            return null;
        }

        // Adjust inventory levels for changes
        adjustInventoryForUpdate(oldPurchase, request);

        PurchaseResponse updated = purchaseRepository.update(purchaseId, request);
        if (updated != null) {
            updated.setMessage("Purchase updated successfully and stock adjusted");
        }
        return updated;
    }

    @Override
    @Transactional
    public boolean delete(int purchaseId) {
        PurchaseResponse oldPurchase = purchaseRepository.findById(purchaseId);
        if (oldPurchase == null) {
            return false;
        }

        // Adjust inventory: subtract quantity from product/warehouse
        updateInventoryQuantity(oldPurchase.getProductId(), oldPurchase.getWarehouseId(), -oldPurchase.getQuantity());

        return purchaseRepository.delete(purchaseId);
    }

    private void adjustInventoryForUpdate(PurchaseResponse oldP, PurchaseRequest newP) {
        if (oldP.getProductId() == newP.getProductId() && oldP.getWarehouseId() == newP.getWarehouseId()) {
            int diff = newP.getQuantity() - oldP.getQuantity();
            if (diff != 0) {
                updateInventoryQuantity(newP.getProductId(), newP.getWarehouseId(), diff);
            }
        } else {
            // Subtract old quantity from old product/warehouse
            updateInventoryQuantity(oldP.getProductId(), oldP.getWarehouseId(), -oldP.getQuantity());
            // Add new quantity to new product/warehouse
            updateInventoryQuantity(newP.getProductId(), newP.getWarehouseId(), newP.getQuantity());
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
            if (delta > 0) {
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
