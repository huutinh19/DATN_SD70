package com.poly.sport.infrastructure.response;

import com.poly.sport.entity.BillDetail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {BillDetail.class})
public interface BillDetailResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Long getId();

    String getName();

    String getShoeCode();

    String getColor();

    String getSize();

    String getThuongHieu();

    String getXuatXu();
    String getTayAo();
    String getCoAo();
    String getChatLieu();

    BigDecimal getPrice();

    Float getDiscountPercent();

    BigDecimal getDiscountValue();
    BigDecimal getShoePrice();

    Integer getQuantity();
    Double getWeight();

    String getImages();

    BigDecimal getTotalMoney();
    Boolean getStatus();
}
