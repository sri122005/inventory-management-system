package com.inventory.repository;

import com.inventory.dto.request.CategoryRequest;
import com.inventory.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryRepository {
        CategoryResponse save(CategoryRequest request);
        CategoryResponse findById(int categoryId);
        List<CategoryResponse> findAll();
        CategoryResponse update(int categoryId, CategoryRequest request);
        boolean delete(int categoryId);
}
