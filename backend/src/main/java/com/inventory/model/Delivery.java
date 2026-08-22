package com.inventory.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("_id")
    public Long get_id() { return id; }

    @Column(nullable = false)
    private String type; // INBOUND or OUTBOUND

    @Column
    private Long orderId;

    @Column
    private Long purchaseOrderId;

    @Column
    private String trackingNumber;

    @Column
    private String carrier;

    @Column(nullable = false)
    @Builder.Default
    private String status = "Pending";

    @Column
    private String origin;

    @Column
    private String destination;

    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    @Builder.Default
    private List<DeliveryItem> items = new ArrayList<>();

    @Column
    private LocalDate estimatedDelivery;

    @Column
    private LocalDate actualDelivery;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
