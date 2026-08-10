package com.inventory.controller;

import com.inventory.dto.request.ProductRequest;
import com.inventory.dto.response.ProductResponse;
import com.inventory.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ProductResponse save(
            @RequestBody ProductRequest request) {

        return productService.save(request);
    }

    @GetMapping
    public List<ProductResponse> findAll() {
        return productService.findAll();
    }

    @GetMapping("/{productId}")
    public ProductResponse findById(
            @PathVariable int productId) {

        return productService.findById(productId);
    }

    @PutMapping("/{productId}")
    public ProductResponse update(
            @PathVariable int productId,
            @RequestBody ProductRequest request) {

        return productService.update(productId, request);
    }

    @DeleteMapping("/{productId}")
    public boolean delete(
            @PathVariable int productId) {

        return productService.delete(productId);
    }
}