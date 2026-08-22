package com.inventory.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private Long sourceWarehouseId;
    private Long destinationWarehouseId;
    private Long productId;
    private Integer quantity;
}
