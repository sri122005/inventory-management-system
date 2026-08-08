package com.inventory.service.impl;

import com.inventory.dto.request.SupplierRequest;
import com.inventory.dto.response.SupplierResponse;
import com.inventory.repository.SupplierRepository;
import com.inventory.service.SupplierService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public SupplierResponse save(SupplierRequest request) {
        return supplierRepository.save(request);
    }

    @Override
    public SupplierResponse findById(int supplierId) {
        return supplierRepository.findById(supplierId);
    }

    @Override
    public List<SupplierResponse> findAll() {
        return supplierRepository.findAll();
    }

    @Override
    public SupplierResponse update(int supplierId, SupplierRequest request) {
        return supplierRepository.update(supplierId, request);
    }

    @Override
    public boolean delete(int supplierId) {
        return supplierRepository.delete(supplierId);
    }
}