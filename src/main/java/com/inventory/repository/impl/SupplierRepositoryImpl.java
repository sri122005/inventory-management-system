package com.inventory.repository.impl;

import com.inventory.dto.request.SupplierRequest;
import com.inventory.dto.response.SupplierResponse;
import com.inventory.repository.SupplierRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SupplierRepositoryImpl implements SupplierRepository {

    private final JdbcTemplate jdbcTemplate;

    public SupplierRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public SupplierResponse save(SupplierRequest request) {

        String sql = """
                INSERT INTO supplier
                (supplier_name, contact_person, phone, email, address, gst_number, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                request.getSupplierName(),
                request.getContactPerson(),
                request.getPhone(),
                request.getEmail(),
                request.getAddress(),
                request.getGstNumber(),
                request.isStatus()
        );

        return findById(
                jdbcTemplate.queryForObject(
                        "SELECT LAST_INSERT_ID()",
                        Integer.class
                )
        );
    }

    @Override
    public SupplierResponse findById(int supplierId) {

        String sql = """
                SELECT *
                FROM supplier
                WHERE supplier_id = ?
                """;

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {

            SupplierResponse response = new SupplierResponse();

            response.setSupplierId(rs.getInt("supplier_id"));
            response.setSupplierName(rs.getString("supplier_name"));
            response.setContactPerson(rs.getString("contact_person"));
            response.setPhone(rs.getString("phone"));
            response.setEmail(rs.getString("email"));
            response.setAddress(rs.getString("address"));
            response.setGstNumber(rs.getString("gst_number"));
            response.setStatus(rs.getBoolean("status"));
            response.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            response.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

            return response;
        }, supplierId);
    }

    @Override
    public List<SupplierResponse> findAll() {

        String sql = "SELECT * FROM supplier";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            SupplierResponse response = new SupplierResponse();

            response.setSupplierId(rs.getInt("supplier_id"));
            response.setSupplierName(rs.getString("supplier_name"));
            response.setContactPerson(rs.getString("contact_person"));
            response.setPhone(rs.getString("phone"));
            response.setEmail(rs.getString("email"));
            response.setAddress(rs.getString("address"));
            response.setGstNumber(rs.getString("gst_number"));
            response.setStatus(rs.getBoolean("status"));
            response.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            response.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

            return response;
        });
    }

    @Override
    public SupplierResponse update(int supplierId, SupplierRequest request) {

        String sql = """
                UPDATE supplier
                SET supplier_name=?,
                    contact_person=?,
                    phone=?,
                    email=?,
                    address=?,
                    gst_number=?,
                    status=?
                WHERE supplier_id=?
                """;

        jdbcTemplate.update(
                sql,
                request.getSupplierName(),
                request.getContactPerson(),
                request.getPhone(),
                request.getEmail(),
                request.getAddress(),
                request.getGstNumber(),
                request.isStatus(),
                supplierId
        );

        return findById(supplierId);
    }

    @Override
    public boolean delete(int supplierId) {

        String sql = "DELETE FROM supplier WHERE supplier_id=?";

        int rows = jdbcTemplate.update(sql, supplierId);

        return rows > 0;
    }
}