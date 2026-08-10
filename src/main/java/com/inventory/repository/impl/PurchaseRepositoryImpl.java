package com.inventory.repository.impl;

import com.inventory.dto.request.PurchaseRequest;
import com.inventory.dto.response.PurchaseResponse;
import com.inventory.repository.PurchaseRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public class PurchaseRepositoryImpl implements PurchaseRepository {

    private final JdbcTemplate jdbcTemplate;

    public PurchaseRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public PurchaseResponse save(PurchaseRequest request) {
        String sql = """
                INSERT INTO purchase (supplier_id, product_id, warehouse_id, quantity, purchase_price, purchase_date)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                request.getSupplierId(),
                request.getProductId(),
                request.getWarehouseId(),
                request.getQuantity(),
                request.getPurchasePrice(),
                request.getPurchaseDate() != null ? Date.valueOf(request.getPurchaseDate().toLocalDate()) : null
        );

        int purchaseId = jdbcTemplate.queryForObject(
                "SELECT LAST_INSERT_ID()",
                Integer.class
        );

        return findById(purchaseId);
    }

    @Override
    public PurchaseResponse findById(int purchaseId) {
        String sql = """
                SELECT *
                FROM purchase
                WHERE purchase_id = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                PurchaseResponse response = new PurchaseResponse();
                response.setPurchaseId(rs.getInt("purchase_id"));
                response.setSupplierId(rs.getInt("supplier_id"));
                response.setProductId(rs.getInt("product_id"));
                response.setWarehouseId(rs.getInt("warehouse_id"));
                response.setQuantity(rs.getInt("quantity"));
                response.setPurchasePrice(rs.getBigDecimal("purchase_price"));
                response.setPurchaseDate(
                        rs.getDate("purchase_date") != null ? rs.getDate("purchase_date").toLocalDate().atStartOfDay() : null
                );
                return response;
            }, purchaseId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<PurchaseResponse> findAll() {
        String sql = "SELECT * FROM purchase";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            PurchaseResponse response = new PurchaseResponse();
            response.setPurchaseId(rs.getInt("purchase_id"));
            response.setSupplierId(rs.getInt("supplier_id"));
            response.setProductId(rs.getInt("product_id"));
            response.setWarehouseId(rs.getInt("warehouse_id"));
            response.setQuantity(rs.getInt("quantity"));
            response.setPurchasePrice(rs.getBigDecimal("purchase_price"));
            response.setPurchaseDate(
                    rs.getDate("purchase_date") != null ? rs.getDate("purchase_date").toLocalDate().atStartOfDay() : null
            );
            return response;
        });
    }

    @Override
    public PurchaseResponse update(int purchaseId, PurchaseRequest request) {
        String sql = """
                UPDATE purchase
                SET supplier_id = ?,
                    product_id = ?,
                    warehouse_id = ?,
                    quantity = ?,
                    purchase_price = ?,
                    purchase_date = ?
                WHERE purchase_id = ?
                """;

        jdbcTemplate.update(
                sql,
                request.getSupplierId(),
                request.getProductId(),
                request.getWarehouseId(),
                request.getQuantity(),
                request.getPurchasePrice(),
                request.getPurchaseDate() != null ? Date.valueOf(request.getPurchaseDate().toLocalDate()) : null,
                purchaseId
        );

        return findById(purchaseId);
    }

    @Override
    public boolean delete(int purchaseId) {
        String sql = "DELETE FROM purchase WHERE purchase_id = ?";
        int rows = jdbcTemplate.update(sql, purchaseId);
        return rows > 0;
    }
}
