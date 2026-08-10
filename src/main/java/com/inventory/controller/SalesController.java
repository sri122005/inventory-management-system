package com.inventory.controller;

import com.inventory.dto.request.SalesRequest;
import com.inventory.dto.response.SalesResponse;
import com.inventory.service.SalesService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    private final SalesService salesService;

    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }

    @PostMapping
    public SalesResponse save(@RequestBody SalesRequest request) {
        return salesService.save(request);
    }

    @GetMapping
    public List<SalesResponse> findAll() {
        return salesService.findAll();
    }

    @GetMapping("/{saleId}")
    public SalesResponse findById(@PathVariable int saleId) {
        return salesService.findById(saleId);
    }

    @PutMapping("/{saleId}")
    public SalesResponse update(@PathVariable int saleId, @RequestBody SalesRequest request) {
        return salesService.update(saleId, request);
    }

    @DeleteMapping("/{saleId}")
    public void delete(@PathVariable int saleId) {
        salesService.delete(saleId);
    }
}
