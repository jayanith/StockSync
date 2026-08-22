package com.inventory.service;

import com.inventory.model.Order;
import com.inventory.model.OrderItem;
import com.inventory.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @SuppressWarnings("unchecked")
    public Order createOrder(Map<String, Object> orderData) {
        Order order = Order.builder()
                .customerName((String) orderData.get("customerName"))
                .customerEmail((String) orderData.get("customerEmail"))
                .shippingAddress((String) orderData.get("shippingAddress"))
                .notes((String) orderData.get("notes"))
                .status(orderData.get("status") != null ? (String) orderData.get("status") : "Pending")
                .total(orderData.get("total") != null ? Double.parseDouble(orderData.get("total").toString()) : 0.0)
                .date(LocalDate.now())
                .items(new ArrayList<>())
                .build();

        // Handle items
        if (orderData.get("items") != null) {
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) orderData.get("items");
            for (Map<String, Object> itemData : itemsData) {
                OrderItem item = OrderItem.builder()
                        .productId(itemData.get("productId") != null ? Long.parseLong(itemData.get("productId").toString()) : null)
                        .productName((String) itemData.get("productName"))
                        .quantity(Integer.parseInt(itemData.get("quantity").toString()))
                        .unitPrice(Double.parseDouble(itemData.get("unitPrice").toString()))
                        .order(order)
                        .build();
                order.getItems().add(item);
            }
        }

        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order cancelOrder(Long id) {
        return updateOrderStatus(id, "Cancelled");
    }
}
