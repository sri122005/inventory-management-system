package com.inventory.controller;

import com.inventory.dto.request.PurchaseRequest;
import com.inventory.dto.response.PurchaseResponse;
import com.inventory.service.PurchaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    public PurchaseResponse save(@RequestBody PurchaseRequest request) {
        return purchaseService.save(request);
    }

    @GetMapping
    public List<PurchaseResponse> findAll() {
        return purchaseService.findAll();
    }

    @GetMapping("/{purchaseId}")
    public PurchaseResponse findById(@PathVariable int purchaseId) {
        return purchaseService.findById(purchaseId);
    }

    @PutMapping("/{purchaseId}")
    public PurchaseResponse update(@PathVariable int purchaseId, @RequestBody PurchaseRequest request) {
        return purchaseService.update(purchaseId, request);
    }

    @DeleteMapping("/{purchaseId}")
    public void delete(@PathVariable int purchaseId) {
        purchaseService.delete(purchaseId);
    }
}
