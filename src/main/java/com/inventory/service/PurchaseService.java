package com.inventory.service;

import com.inventory.dto.request.PurchaseRequest;
import com.inventory.dto.response.PurchaseResponse;

import java.util.List;

public interface PurchaseService {
    PurchaseResponse save(PurchaseRequest request);
    PurchaseResponse findById(int purchaseId);
    List<PurchaseResponse> findAll();
    PurchaseResponse update(int purchaseId, PurchaseRequest request);
    boolean delete(int purchaseId);
}
