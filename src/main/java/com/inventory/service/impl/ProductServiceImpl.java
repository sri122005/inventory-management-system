package com.inventory.service.impl;

import com.inventory.dto.request.ProductRequest;
import com.inventory.dto.response.ProductResponse;
import com.inventory.repository.ProductRepository;
import com.inventory.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductResponse save(ProductRequest request) {
        return productRepository.save(request);
    }

    @Override
    public ProductResponse findById(int productId) {
        return productRepository.findById(productId);
    }

    @Override
    public List<ProductResponse> findAll() {
        return productRepository.findAll();
    }

    @Override
    public ProductResponse update(
            int productId,
            ProductRequest request) {

        return productRepository.update(productId, request);
    }

    @Override
    public boolean delete(int productId) {
        return productRepository.delete(productId);
    }
}