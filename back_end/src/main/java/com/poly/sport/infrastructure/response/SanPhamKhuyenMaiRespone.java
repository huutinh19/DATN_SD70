package com.poly.sport.infrastructure.response;

import com.poly.sport.entity.SanPham;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {SanPham.class})
public interface SanPhamKhuyenMaiRespone {
    @Value("#{target.indexs}")
    Integer getIndex();

    Long getId();

    String getName();

    String getSize();

    String getColor();

    String getBrand();

    String getCategory();

    Integer getQuantity();

    Boolean getStatus();
    Integer getDiscount();
}
