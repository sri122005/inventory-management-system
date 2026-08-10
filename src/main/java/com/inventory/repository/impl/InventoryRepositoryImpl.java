package com.inventory.repository.impl;

import com.inventory.dto.request.InventoryRequest;
import com.inventory.dto.response.InventoryResponse;
import com.inventory.repository.InventoryRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class InventoryRepositoryImpl implements InventoryRepository {

    private final JdbcTemplate jdbcTemplate;

    public InventoryRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public InventoryResponse save(InventoryRequest request) {
        String sql = """
                INSERT INTO inventory (product_id, warehouse_id, quantity)
                VALUES (?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                request.getProductId(),
                request.getWarehouseId(),
                request.getQuantity()
        );

        int inventoryId = jdbcTemplate.queryForObject(
                "SELECT LAST_INSERT_ID()",
                Integer.class
        );

        return findById(inventoryId);
    }

    @Override
    public InventoryResponse findById(int inventoryId) {
        String sql = """
                SELECT *
                FROM inventory
                WHERE inventory_id = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                InventoryResponse response = new InventoryResponse();
                response.setInventoryId(rs.getInt("inventory_id"));
                response.setProductId(rs.getInt("product_id"));
                response.setWarehouseId(rs.getInt("warehouse_id"));
                response.setQuantity(rs.getInt("quantity"));
                response.setLastUpdated(rs.getTimestamp("last_updated").toLocalDateTime());
                return response;
            }, inventoryId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public InventoryResponse findByProductAndWarehouse(int productId, int warehouseId) {
        String sql = """
                SELECT *
                FROM inventory
                WHERE product_id = ? AND warehouse_id = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                InventoryResponse response = new InventoryResponse();
                response.setInventoryId(rs.getInt("inventory_id"));
                response.setProductId(rs.getInt("product_id"));
                response.setWarehouseId(rs.getInt("warehouse_id"));
                response.setQuantity(rs.getInt("quantity"));
                response.setLastUpdated(rs.getTimestamp("last_updated").toLocalDateTime());
                return response;
            }, productId, warehouseId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<InventoryResponse> findAll() {
        String sql = "SELECT * FROM inventory";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            InventoryResponse response = new InventoryResponse();
            response.setInventoryId(rs.getInt("inventory_id"));
            response.setProductId(rs.getInt("product_id"));
            response.setWarehouseId(rs.getInt("warehouse_id"));
            response.setQuantity(rs.getInt("quantity"));
            response.setLastUpdated(rs.getTimestamp("last_updated").toLocalDateTime());
            return response;
        });
    }

    @Override
    public InventoryResponse update(int inventoryId, InventoryRequest request) {
        String sql = """
                UPDATE inventory
                SET product_id = ?,
                    warehouse_id = ?,
                    quantity = ?
                WHERE inventory_id = ?
                """;

        jdbcTemplate.update(
                sql,
                request.getProductId(),
                request.getWarehouseId(),
                request.getQuantity(),
                inventoryId
        );

        return findById(inventoryId);
    }

    @Override
    public boolean delete(int inventoryId) {
        String sql = "DELETE FROM inventory WHERE inventory_id = ?";
        int rows = jdbcTemplate.update(sql, inventoryId);
        return rows > 0;
    }
}
