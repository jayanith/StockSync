package com.inventory.service;

import com.inventory.model.Delivery;
import com.inventory.model.DeliveryItem;
import com.inventory.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public Delivery getDeliveryById(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
    }

    @SuppressWarnings("unchecked")
    public Delivery createDelivery(Map<String, Object> deliveryData, String type) {
        Delivery delivery = Delivery.builder()
                .type(type)
                .trackingNumber((String) deliveryData.get("trackingNumber"))
                .carrier((String) deliveryData.get("carrier"))
                .origin((String) deliveryData.get("origin"))
                .destination((String) deliveryData.get("destination"))
                .notes((String) deliveryData.get("notes"))
                .status(deliveryData.get("status") != null ? (String) deliveryData.get("status") : "Pending")
                .items(new ArrayList<>())
                .build();

        if (deliveryData.get("orderId") != null) {
            delivery.setOrderId(Long.parseLong(deliveryData.get("orderId").toString()));
        }
        if (deliveryData.get("purchaseOrderId") != null) {
            delivery.setPurchaseOrderId(Long.parseLong(deliveryData.get("purchaseOrderId").toString()));
        }
        if (deliveryData.get("estimatedDelivery") != null && !deliveryData.get("estimatedDelivery").toString().isEmpty()) {
            delivery.setEstimatedDelivery(LocalDate.parse(deliveryData.get("estimatedDelivery").toString()));
        }

        // Handle items
        if (deliveryData.get("items") != null) {
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) deliveryData.get("items");
            for (Map<String, Object> itemData : itemsData) {
                DeliveryItem item = DeliveryItem.builder()
                        .productId(itemData.get("productId") != null ? Long.parseLong(itemData.get("productId").toString()) : null)
                        .productName((String) itemData.get("productName"))
                        .quantity(Integer.parseInt(itemData.get("quantity").toString()))
                        .delivery(delivery)
                        .build();
                delivery.getItems().add(item);
            }
        }

        return deliveryRepository.save(delivery);
    }

    public Delivery updateDeliveryStatus(Long id, String status) {
        Delivery delivery = getDeliveryById(id);
        delivery.setStatus(status);
        if ("Delivered".equals(status)) {
            delivery.setActualDelivery(LocalDate.now());
        }
        return deliveryRepository.save(delivery);
    }

    public Delivery cancelDelivery(Long id) {
        return updateDeliveryStatus(id, "Cancelled");
    }
}
