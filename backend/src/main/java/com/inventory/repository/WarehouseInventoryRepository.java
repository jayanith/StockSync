package com.inventory.repository;

import com.inventory.model.WarehouseInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseInventoryRepository extends JpaRepository<WarehouseInventory, Long> {
    List<WarehouseInventory> findByWarehouseId(Long warehouseId);
    Optional<WarehouseInventory> findByWarehouseIdAndProductId(Long warehouseId, Long productId);
}
