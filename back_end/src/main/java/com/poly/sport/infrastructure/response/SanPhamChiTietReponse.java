package com.poly.sport.infrastructure.response;

import com.poly.sport.entity.SanPhamChiTiet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {SanPhamChiTiet.class})
public interface SanPhamChiTietReponse {
    Long getId();
    @Value("#{target.indexs}")
    Integer getIndex();

    String getCode();
    String getName();



    String getColor();

    String getSize();
    BigDecimal getDiscountPercent();
    BigDecimal getDiscountValue();

    Integer getQuantity();

    BigDecimal getPrice();

    Double getWeight();

    String getImages();
    Boolean getStatus();

}
