package com.inventory.repository.impl;

import com.inventory.dto.request.CategoryRequest;
import com.inventory.dto.response.CategoryResponse;
import com.inventory.repository.CategoryRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CategoryRepositoryImpl implements CategoryRepository {
    private final JdbcTemplate jdbcTemplate;
    public CategoryRepositoryImpl(JdbcTemplate jdbcTemplate){
            this.jdbcTemplate=jdbcTemplate;
    }
    @Override
    public CategoryResponse save(CategoryRequest request){
        String sql = """
            INSERT INTO category
            (category_name, description, status)
            VALUES (?, ?, ?)
            """;

        jdbcTemplate.update(
                sql,
                request.getCategoryName(),
                request.getDescription(),
                true);
        CategoryResponse response = new CategoryResponse();
        response.setCategoryName(request.getCategoryName());
        response.setDescription(request.getDescription());
        response.setStatus(true);
        response.setMessage("Category created successfully");

        return response;
    }
    @Override
    public CategoryResponse findById(int categoryId) {
        return null;
    }
    @Override
    public List<CategoryResponse> findAll() {
        String sql="SELECT * FROM category";

        return jdbcTemplate.query(sql,(rs, rowNum) -> {
            CategoryResponse response = new CategoryResponse();
            response.setCategoryId(rs.getInt("category_Id"));
            response.setCategoryName(rs.getString("category_name"));
            response.setDescription(rs.getString("description"));
            response.setStatus(rs.getBoolean("status"));
            return response;
        });
    }

    @Override
    public CategoryResponse update(int categoryId, CategoryRequest request) {
        String sql = "UPDATE category SET category_name=?, description=? WHERE category_Id=?";
        jdbcTemplate.update(sql,request.getCategoryName(),request.getDescription(),categoryId);
        return findById(categoryId);
    }
    @Override
    public boolean delete(int categoryId) {
        String sql="DELETE FROM category WHERE category_id=?";
        int rows=jdbcTemplate.update(sql,categoryId);
        return rows>0;
    }
}
