package com.inventory.controller;

import com.inventory.dto.ApiResponse;
import com.inventory.dto.StatusUpdateRequest;
import com.inventory.model.PurchaseOrder;
import com.inventory.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/purchase-orders")
@CrossOrigin(origins = "*")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @GetMapping
    public ResponseEntity<?> getAllPurchaseOrders() {
        List<PurchaseOrder> pos = purchaseOrderService.getAllPurchaseOrders();
        return ResponseEntity.ok(ApiResponse.success(pos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPurchaseOrderById(@PathVariable Long id) {
        try {
            PurchaseOrder po = purchaseOrderService.getPurchaseOrderById(id);
            return ResponseEntity.ok(ApiResponse.success(po));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createPurchaseOrder(@RequestBody Map<String, Object> poData) {
        try {
            PurchaseOrder po = purchaseOrderService.createPurchaseOrder(poData);
            return ResponseEntity.ok(ApiResponse.success("Purchase order created successfully", po));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            PurchaseOrder po = purchaseOrderService.updateStatus(id, request.getStatus());
            return ResponseEntity.ok(ApiResponse.success("Status updated", po));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelPurchaseOrder(@PathVariable Long id) {
        try {
            PurchaseOrder po = purchaseOrderService.cancelPurchaseOrder(id);
            return ResponseEntity.ok(ApiResponse.success("Purchase order cancelled", po));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<?> receiveItems(@PathVariable Long id, @RequestBody Map<String, Object> receiveData) {
        try {
            PurchaseOrder po = purchaseOrderService.receiveItems(id, receiveData);
            return ResponseEntity.ok(ApiResponse.success("Items received", po));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
