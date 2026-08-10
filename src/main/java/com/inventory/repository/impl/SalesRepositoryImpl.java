package com.inventory.repository.impl;

import com.inventory.dto.request.SalesRequest;
import com.inventory.dto.response.SalesResponse;
import com.inventory.repository.SalesRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public class SalesRepositoryImpl implements SalesRepository {

    private final JdbcTemplate jdbcTemplate;

    public SalesRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public SalesResponse save(SalesRequest request) {
        String sql = """
                INSERT INTO sales (product_id, warehouse_id, quantity, selling_price, sale_date)
                VALUES (?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                request.getProductId(),
                request.getWarehouseId(),
                request.getQuantity(),
                request.getSellingPrice(),
                request.getSaleDate() != null ? Date.valueOf(request.getSaleDate().toLocalDate()) : null
        );

        int saleId = jdbcTemplate.queryForObject(
                "SELECT LAST_INSERT_ID()",
                Integer.class
        );

        return findById(saleId);
    }

    @Override
    public SalesResponse findById(int saleId) {
        String sql = """
                SELECT *
                FROM sales
                WHERE sale_id = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                SalesResponse response = new SalesResponse();
                response.setSaleId(rs.getInt("sale_id"));
                response.setProductId(rs.getInt("product_id"));
                response.setWarehouseId(rs.getInt("warehouse_id"));
                response.setQuantity(rs.getInt("quantity"));
                response.setSellingPrice(rs.getBigDecimal("selling_price"));
                response.setSaleDate(
                        rs.getDate("sale_date") != null ? rs.getDate("sale_date").toLocalDate().atStartOfDay() : null
                );
                return response;
            }, saleId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<SalesResponse> findAll() {
        String sql = "SELECT * FROM sales";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            SalesResponse response = new SalesResponse();
            response.setSaleId(rs.getInt("sale_id"));
            response.setProductId(rs.getInt("product_id"));
            response.setWarehouseId(rs.getInt("warehouse_id"));
            response.setQuantity(rs.getInt("quantity"));
            response.setSellingPrice(rs.getBigDecimal("selling_price"));
            response.setSaleDate(
                    rs.getDate("sale_date") != null ? rs.getDate("sale_date").toLocalDate().atStartOfDay() : null
            );
            return response;
        });
    }

    @Override
    public SalesResponse update(int saleId, SalesRequest request) {
        String sql = """
                UPDATE sales
                SET product_id = ?,
                    warehouse_id = ?,
                    quantity = ?,
                    selling_price = ?,
                    sale_date = ?
                WHERE sale_id = ?
                """;

        jdbcTemplate.update(
                sql,
                request.getProductId(),
                request.getWarehouseId(),
                request.getQuantity(),
                request.getSellingPrice(),
                request.getSaleDate() != null ? Date.valueOf(request.getSaleDate().toLocalDate()) : null,
                saleId
        );

        return findById(saleId);
    }

    @Override
    public boolean delete(int saleId) {
        String sql = "DELETE FROM sales WHERE sale_id = ?";
        int rows = jdbcTemplate.update(sql, saleId);
        return rows > 0;
    }
}
