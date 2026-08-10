package com.inventory.service.impl;

import com.inventory.dto.request.WarehouseRequest;
import com.inventory.dto.response.WarehouseResponse;
import com.inventory.repository.WarehouseRepository;
import com.inventory.service.WarehouseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseServiceImpl(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    @Override
    public WarehouseResponse save(WarehouseRequest request) {
        return warehouseRepository.save(request);
    }

    @Override
    public WarehouseResponse findById(int warehouseId) {
        return warehouseRepository.findById(warehouseId);
    }

    @Override
    public List<WarehouseResponse> findAll() {
        return warehouseRepository.findAll();
    }

    @Override
    public WarehouseResponse update(
            int warehouseId,
            WarehouseRequest request) {

        return warehouseRepository.update(warehouseId, request);
    }

    @Override
    public boolean delete(int warehouseId) {
        return warehouseRepository.delete(warehouseId);
    }
}