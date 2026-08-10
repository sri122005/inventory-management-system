package com.inventory.controller;

import com.inventory.dto.request.InventoryRequest;
import com.inventory.dto.response.InventoryResponse;
import com.inventory.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public InventoryResponse save(@RequestBody InventoryRequest request) {
        return inventoryService.save(request);
    }

    @GetMapping
    public List<InventoryResponse> findAll() {
        return inventoryService.findAll();
    }

    @GetMapping("/{inventoryId}")
    public InventoryResponse findById(@PathVariable int inventoryId) {
        return inventoryService.findById(inventoryId);
    }

    @PutMapping("/{inventoryId}")
    public InventoryResponse update(@PathVariable int inventoryId, @RequestBody InventoryRequest request) {
        return inventoryService.update(inventoryId, request);
    }

    @DeleteMapping("/{inventoryId}")
    public void delete(@PathVariable int inventoryId) {
        inventoryService.delete(inventoryId);
    }
}
