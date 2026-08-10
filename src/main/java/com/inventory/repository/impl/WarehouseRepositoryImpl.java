package com.inventory.repository.impl;

import com.inventory.dto.request.WarehouseRequest;
import com.inventory.dto.response.WarehouseResponse;
import com.inventory.repository.WarehouseRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class WarehouseRepositoryImpl implements WarehouseRepository {

    private final JdbcTemplate jdbcTemplate;

    public WarehouseRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public WarehouseResponse save(WarehouseRequest request) {

        String sql = """
                INSERT INTO warehouse
                (warehouse_name, location, capacity, manager_name,
                 phone, email, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                request.getWarehouseName(),
                request.getLocation(),
                request.getCapacity(),
                request.getManagerName(),
                request.getPhone(),
                request.getEmail(),
                request.isStatus()
        );

        int warehouseId = jdbcTemplate.queryForObject(
                "SELECT LAST_INSERT_ID()",
                Integer.class
        );

        return findById(warehouseId);
    }

    @Override
    public WarehouseResponse findById(int warehouseId) {

        String sql = """
                SELECT *
                FROM warehouse
                WHERE warehouse_id = ?
                """;

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {

            WarehouseResponse response = new WarehouseResponse();

            response.setWarehouseId(rs.getInt("warehouse_id"));
            response.setWarehouseName(rs.getString("warehouse_name"));
            response.setLocation(rs.getString("location"));
            response.setCapacity(rs.getInt("capacity"));
            response.setManagerName(rs.getString("manager_name"));
            response.setPhone(rs.getString("phone"));
            response.setEmail(rs.getString("email"));
            response.setStatus(rs.getBoolean("status"));
            response.setCreatedAt(
                    rs.getTimestamp("created_at").toLocalDateTime()
            );
            response.setUpdatedAt(
                    rs.getTimestamp("updated_at").toLocalDateTime()
            );

            return response;

        }, warehouseId);
    }

    @Override
    public List<WarehouseResponse> findAll() {

        String sql = "SELECT * FROM warehouse";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            WarehouseResponse response = new WarehouseResponse();

            response.setWarehouseId(rs.getInt("warehouse_id"));
            response.setWarehouseName(rs.getString("warehouse_name"));
            response.setLocation(rs.getString("location"));
            response.setCapacity(rs.getInt("capacity"));
            response.setManagerName(rs.getString("manager_name"));
            response.setPhone(rs.getString("phone"));
            response.setEmail(rs.getString("email"));
            response.setStatus(rs.getBoolean("status"));
            response.setCreatedAt(
                    rs.getTimestamp("created_at").toLocalDateTime()
            );
            response.setUpdatedAt(
                    rs.getTimestamp("updated_at").toLocalDateTime()
            );

            return response;
        });
    }

    @Override
    public WarehouseResponse update(
            int warehouseId,
            WarehouseRequest request) {

        String sql = """
                UPDATE warehouse
                SET warehouse_name = ?,
                    location = ?,
                    capacity = ?,
                    manager_name = ?,
                    phone = ?,
                    email = ?,
                    status = ?
                WHERE warehouse_id = ?
                """;

        jdbcTemplate.update(
                sql,
                request.getWarehouseName(),
                request.getLocation(),
                request.getCapacity(),
                request.getManagerName(),
                request.getPhone(),
                request.getEmail(),
                request.isStatus(),
                warehouseId
        );

        return findById(warehouseId);
    }

    @Override
    public boolean delete(int warehouseId) {

        String sql =
                "DELETE FROM warehouse WHERE warehouse_id = ?";

        int rows = jdbcTemplate.update(sql, warehouseId);

        return rows > 0;
    }
}