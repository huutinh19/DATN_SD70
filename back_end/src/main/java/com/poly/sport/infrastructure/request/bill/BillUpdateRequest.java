package com.poly.sport.infrastructure.request.bill;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillUpdateRequest {
    private Integer quantity;
    private String address;
    private Boolean isDeleted;
}