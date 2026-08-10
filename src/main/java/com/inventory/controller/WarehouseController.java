package com.inventory.controller;

import com.inventory.dto.request.WarehouseRequest;
import com.inventory.dto.response.WarehouseResponse;
import com.inventory.service.WarehouseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @PostMapping
    public WarehouseResponse save(
            @RequestBody WarehouseRequest request) {

        return warehouseService.save(request);
    }

    @GetMapping
    public List<WarehouseResponse> findAll() {
        return warehouseService.findAll();
    }

    @GetMapping("/{warehouseId}")
    public WarehouseResponse findById(
            @PathVariable int warehouseId) {

        return warehouseService.findById(warehouseId);
    }

    @PutMapping("/{warehouseId}")
    public WarehouseResponse update(
            @PathVariable int warehouseId,
            @RequestBody WarehouseRequest request) {

        return warehouseService.update(warehouseId, request);
    }

    @DeleteMapping("/{warehouseId}")
    public boolean delete(
            @PathVariable int warehouseId) {

        return warehouseService.delete(warehouseId);
    }
}