package com.inventory.service;

import com.inventory.dto.request.ProductRequest;
import com.inventory.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse save(ProductRequest request);

    ProductResponse findById(int productId);

    List<ProductResponse> findAll();

    ProductResponse update(int productId, ProductRequest request);

    boolean delete(int productId);
}