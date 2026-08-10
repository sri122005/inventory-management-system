package com.inventory.repository.impl;

import com.inventory.dto.request.ProductRequest;
import com.inventory.dto.response.ProductResponse;
import com.inventory.repository.ProductRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductRepositoryImpl implements ProductRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProductRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public ProductResponse save(ProductRequest request) {

        String sql = """
                INSERT INTO product
                (product_name, sku, barcode, purchase_price,
                 selling_price, minimum_stock, category_id, supplier_id, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                request.getProductName(),
                request.getSku(),
                request.getBarcode(),
                request.getPurchasePrice(),
                request.getSellingPrice(),
                request.getMinimumStock(),
                request.getCategoryId(),
                request.getSupplierId(),
                request.isStatus()
        );

        int productId = jdbcTemplate.queryForObject(
                "SELECT LAST_INSERT_ID()",
                Integer.class
        );

        return findById(productId);
    }

    @Override
    public ProductResponse findById(int productId) {

        String sql = """
                SELECT *
                FROM product
                WHERE product_id = ?
                """;

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {

            ProductResponse response = new ProductResponse();

            response.setProductId(rs.getInt("product_id"));
            response.setProductName(rs.getString("product_name"));
            response.setSku(rs.getString("sku"));
            response.setBarcode(rs.getString("barcode"));
            response.setPurchasePrice(rs.getBigDecimal("purchase_price"));
            response.setSellingPrice(rs.getBigDecimal("selling_price"));
            response.setMinimumStock(rs.getInt("minimum_stock"));
            response.setCategoryId(rs.getInt("category_id"));
            response.setSupplierId(rs.getInt("supplier_id"));
            response.setStatus(rs.getBoolean("status"));
            response.setCreatedAt(
                    rs.getTimestamp("created_at").toLocalDateTime()
            );
            response.setUpdatedAt(
                    rs.getTimestamp("updated_at").toLocalDateTime()
            );

            return response;

        }, productId);
    }

    @Override
    public List<ProductResponse> findAll() {

        String sql = "SELECT * FROM product";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            ProductResponse response = new ProductResponse();

            response.setProductId(rs.getInt("product_id"));
            response.setProductName(rs.getString("product_name"));
            response.setSku(rs.getString("sku"));
            response.setBarcode(rs.getString("barcode"));
            response.setPurchasePrice(rs.getBigDecimal("purchase_price"));
            response.setSellingPrice(rs.getBigDecimal("selling_price"));
            response.setMinimumStock(rs.getInt("minimum_stock"));
            response.setCategoryId(rs.getInt("category_id"));
            response.setSupplierId(rs.getInt("supplier_id"));
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
    public ProductResponse update(
            int productId,
            ProductRequest request) {

        String sql = """
                UPDATE product
                SET product_name = ?,
                    sku = ?,
                    barcode = ?,
                    purchase_price = ?,
                    selling_price = ?,
                    minimum_stock = ?,
                    category_id = ?,
                    supplier_id = ?,
                    status = ?
                WHERE product_id = ?
                """;

        jdbcTemplate.update(
                sql,
                request.getProductName(),
                request.getSku(),
                request.getBarcode(),
                request.getPurchasePrice(),
                request.getSellingPrice(),
                request.getMinimumStock(),
                request.getCategoryId(),
                request.getSupplierId(),
                request.isStatus(),
                productId
        );

        return findById(productId);
    }

    @Override
    public boolean delete(int productId) {

        String sql =
                "DELETE FROM product WHERE product_id = ?";

        int rows = jdbcTemplate.update(sql, productId);

        return rows > 0;
    }
}