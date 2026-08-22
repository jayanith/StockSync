package com.inventory.repository;

import com.inventory.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByType(String type);
    List<Delivery> findByStatus(String status);
    List<Delivery> findByOrderId(Long orderId);
}
