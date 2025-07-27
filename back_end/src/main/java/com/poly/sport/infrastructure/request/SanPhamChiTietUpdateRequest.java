package com.poly.sport.infrastructure.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SanPhamChiTietUpdateRequest {
    private Long shoe;
    @NotNull(message = "Vui lòng chọn màu sắc!")
    private String color;
    @NotNull(message = "Vui lòng chọn kích cỡ!")
    private String size;

    @NotNull(message = "Số lượng không được để trống!")
    private Integer quantity;
    @NotNull(message = "Đơn giá không được để trống!")
    private BigDecimal price;
//    @NotNull(message = "Cân nặng không được để trống!")
    private Double weight;

    private Boolean deleted;
}
