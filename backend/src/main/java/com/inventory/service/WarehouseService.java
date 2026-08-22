package com.inventory.service;

import com.inventory.dto.TransferRequest;
import com.inventory.model.Product;
import com.inventory.model.Warehouse;
import com.inventory.model.WarehouseInventory;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.WarehouseInventoryRepository;
import com.inventory.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class WarehouseService {

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private WarehouseInventoryRepository warehouseInventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public Warehouse getWarehouseById(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + id));
    }

    public Warehouse createWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    public Warehouse updateWarehouse(Long id, Warehouse warehouseData) {
        Warehouse warehouse = getWarehouseById(id);
        if (warehouseData.getName() != null) warehouse.setName(warehouseData.getName());
        if (warehouseData.getLocation() != null) warehouse.setLocation(warehouseData.getLocation());
        if (warehouseData.getAddress() != null) warehouse.setAddress(warehouseData.getAddress());
        if (warehouseData.getCapacity() != null) warehouse.setCapacity(warehouseData.getCapacity());
        if (warehouseData.getManager() != null) warehouse.setManager(warehouseData.getManager());
        if (warehouseData.getPhone() != null) warehouse.setPhone(warehouseData.getPhone());
        if (warehouseData.getEmail() != null) warehouse.setEmail(warehouseData.getEmail());
        if (warehouseData.getStatus() != null) warehouse.setStatus(warehouseData.getStatus());
        return warehouseRepository.save(warehouse);
    }

    public void deleteWarehouse(Long id) {
        warehouseRepository.deleteById(id);
    }

    public List<WarehouseInventory> getWarehouseInventory(Long warehouseId) {
        return warehouseInventoryRepository.findByWarehouseId(warehouseId);
    }

    @Transactional
    public Map<String, Object> transferInventory(TransferRequest request) {
        Warehouse source = getWarehouseById(request.getSourceWarehouseId());
        Warehouse destination = getWarehouseById(request.getDestinationWarehouseId());
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Find or create source inventory
        WarehouseInventory sourceInventory = warehouseInventoryRepository
                .findByWarehouseIdAndProductId(source.getId(), product.getId())
                .orElseThrow(() -> new RuntimeException("Product not found in source warehouse"));

        if (sourceInventory.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock in source warehouse");
        }

        // Update source
        sourceInventory.setQuantity(sourceInventory.getQuantity() - request.getQuantity());
        warehouseInventoryRepository.save(sourceInventory);

        // Find or create destination inventory
        WarehouseInventory destInventory = warehouseInventoryRepository
                .findByWarehouseIdAndProductId(destination.getId(), product.getId())
                .orElse(WarehouseInventory.builder()
                        .warehouse(destination)
                        .product(product)
                        .quantity(0)
                        .build());

        destInventory.setQuantity(destInventory.getQuantity() + request.getQuantity());
        warehouseInventoryRepository.save(destInventory);

        return Map.of(
                "message", "Transfer completed successfully",
                "productId", product.getId(),
                "quantity", request.getQuantity(),
                "sourceWarehouse", source.getName(),
                "destinationWarehouse", destination.getName()
        );
    }
}
