package com.inventory.service;

import com.inventory.model.PurchaseOrder;
import com.inventory.model.PurchaseOrderItem;
import com.inventory.model.Supplier;
import com.inventory.repository.PurchaseOrderRepository;
import com.inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with id: " + id));
    }

    @SuppressWarnings("unchecked")
    public PurchaseOrder createPurchaseOrder(Map<String, Object> poData) {
        PurchaseOrder po = PurchaseOrder.builder()
                .notes((String) poData.get("notes"))
                .status(poData.get("status") != null ? (String) poData.get("status") : "Draft")
                .total(poData.get("total") != null ? Double.parseDouble(poData.get("total").toString()) : 0.0)
                .items(new ArrayList<>())
                .build();

        // Handle supplier
        if (poData.get("supplierId") != null) {
            try {
                Long supplierId = Long.parseLong(poData.get("supplierId").toString());
                Supplier supplier = supplierRepository.findById(supplierId).orElse(null);
                po.setSupplier(supplier);
                po.setSupplierName(supplier != null ? supplier.getName() : (String) poData.get("supplierName"));
            } catch (NumberFormatException e) {
                po.setSupplierName((String) poData.get("supplierName"));
            }
        }

        // Handle dates
        if (poData.get("date") != null) {
            po.setDate(LocalDate.parse(poData.get("date").toString()));
        }
        if (poData.get("expectedDeliveryDate") != null && !poData.get("expectedDeliveryDate").toString().isEmpty()) {
            po.setExpectedDeliveryDate(LocalDate.parse(poData.get("expectedDeliveryDate").toString()));
        }

        // Handle items
        if (poData.get("items") != null) {
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) poData.get("items");
            for (Map<String, Object> itemData : itemsData) {
                PurchaseOrderItem item = PurchaseOrderItem.builder()
                        .productId(itemData.get("productId") != null ? Long.parseLong(itemData.get("productId").toString()) : null)
                        .productName((String) itemData.get("productName"))
                        .quantity(Integer.parseInt(itemData.get("quantity").toString()))
                        .unitCost(Double.parseDouble(itemData.get("unitCost").toString()))
                        .purchaseOrder(po)
                        .build();
                po.getItems().add(item);
            }
            po.setItemsCount(po.getItems().size());
        }

        return purchaseOrderRepository.save(po);
    }

    public PurchaseOrder updateStatus(Long id, String status) {
        PurchaseOrder po = getPurchaseOrderById(id);
        po.setStatus(status);
        return purchaseOrderRepository.save(po);
    }

    public PurchaseOrder cancelPurchaseOrder(Long id) {
        return updateStatus(id, "Cancelled");
    }

    @SuppressWarnings("unchecked")
    public PurchaseOrder receiveItems(Long id, Map<String, Object> receiveData) {
        PurchaseOrder po = getPurchaseOrderById(id);

        if (receiveData.get("items") != null) {
            List<Map<String, Object>> receivedItems = (List<Map<String, Object>>) receiveData.get("items");
            for (Map<String, Object> receivedItem : receivedItems) {
                Long productId = Long.parseLong(receivedItem.get("productId").toString());
                int receivedQty = Integer.parseInt(receivedItem.get("receivedQuantity").toString());

                po.getItems().stream()
                        .filter(item -> item.getProductId().equals(productId))
                        .findFirst()
                        .ifPresent(item -> item.setReceivedQuantity(
                                item.getReceivedQuantity() + receivedQty));
            }
        }

        // Check if all items are fully received
        boolean allReceived = po.getItems().stream()
                .allMatch(item -> item.getReceivedQuantity() >= item.getQuantity());
        if (allReceived) {
            po.setStatus("Received");
        } else {
            po.setStatus("Partially Received");
        }

        return purchaseOrderRepository.save(po);
    }
}
