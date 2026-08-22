package com.inventory.controller;

import com.inventory.dto.ApiResponse;
import com.inventory.dto.StatusUpdateRequest;
import com.inventory.model.Delivery;
import com.inventory.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @GetMapping
    public ResponseEntity<?> getAllDeliveries() {
        List<Delivery> deliveries = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDeliveryById(@PathVariable Long id) {
        try {
            Delivery delivery = deliveryService.getDeliveryById(id);
            return ResponseEntity.ok(ApiResponse.success(delivery));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/outbound")
    public ResponseEntity<?> createOutboundDelivery(@RequestBody Map<String, Object> deliveryData) {
        try {
            Delivery delivery = deliveryService.createDelivery(deliveryData, "OUTBOUND");
            return ResponseEntity.ok(ApiResponse.success("Outbound delivery created", delivery));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/inbound")
    public ResponseEntity<?> createInboundDelivery(@RequestBody Map<String, Object> deliveryData) {
        try {
            Delivery delivery = deliveryService.createDelivery(deliveryData, "INBOUND");
            return ResponseEntity.ok(ApiResponse.success("Inbound delivery created", delivery));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDeliveryStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            Delivery delivery = deliveryService.updateDeliveryStatus(id, request.getStatus());
            return ResponseEntity.ok(ApiResponse.success("Delivery status updated", delivery));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelDelivery(@PathVariable Long id) {
        try {
            Delivery delivery = deliveryService.cancelDelivery(id);
            return ResponseEntity.ok(ApiResponse.success("Delivery cancelled", delivery));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
