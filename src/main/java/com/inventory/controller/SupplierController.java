package com.inventory.controller;

import com.inventory.dto.request.SupplierRequest;
import com.inventory.dto.response.SupplierResponse;
import com.inventory.service.SupplierService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    public SupplierResponse save(@RequestBody SupplierRequest request) {
        return supplierService.save(request);
    }

    @GetMapping
    public List<SupplierResponse> findAll() {
        return supplierService.findAll();
    }

    @GetMapping("/{supplierId}")
    public SupplierResponse findById(@PathVariable int supplierId) {
        return supplierService.findById(supplierId);
    }

    @PutMapping("/{supplierId}")
    public SupplierResponse update(
            @PathVariable int supplierId,
            @RequestBody SupplierRequest request) {

        return supplierService.update(supplierId, request);
    }

    @DeleteMapping("/{supplierId}")
    public boolean delete(@PathVariable int supplierId) {
        return supplierService.delete(supplierId);
    }
}