package com.inventory.service.impl;

import com.inventory.dto.request.CategoryRequest;
import com.inventory.dto.response.CategoryResponse;
import com.inventory.repository.CategoryRepository;
import com.inventory.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryResponse save(CategoryRequest request) {
        return categoryRepository.save(request);
    }

    @Override
    public CategoryResponse findById(int categoryId) {
        return categoryRepository.findById(categoryId);
    }

    @Override
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public CategoryResponse update(int categoryId, CategoryRequest request) {
        return categoryRepository.update(categoryId, request);
    }

    @Override
    public boolean delete(int categoryId) {
        return categoryRepository.delete(categoryId);
    }
}