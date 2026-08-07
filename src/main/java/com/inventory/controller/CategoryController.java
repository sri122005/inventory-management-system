package com.inventory.controller;

import com.inventory.dto.request.CategoryRequest;
import com.inventory.dto.response.CategoryResponse;
import com.inventory.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public CategoryResponse save(@RequestBody CategoryRequest request) {
        return categoryService.save(request);
    }
    @GetMapping
    public List<CategoryResponse> findAll() {
        return categoryService.findAll();
    }
    @GetMapping("/{categoryId}")
    public CategoryResponse findById(@PathVariable int categoryId) {
        return categoryService.findById(categoryId);
    }
    @PutMapping("/{categoryId}")
    public CategoryResponse update(@PathVariable int categoryId, @RequestBody CategoryRequest request){
        return categoryService.update(categoryId, request);
    }
    @DeleteMapping("/{categoryId}")
    public void delete(@PathVariable int categoryId){
        categoryService.delete(categoryId);
    }
}
