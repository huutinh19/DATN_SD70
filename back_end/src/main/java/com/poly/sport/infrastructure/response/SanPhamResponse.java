package com.poly.sport.infrastructure.response;


import com.poly.sport.entity.SanPham;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {SanPham.class})
public interface SanPhamResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    String getCode();
    Long getId();

    String getName();

    String getSize();

    String getColor();

    String getThuongHieu();

    String getXuatXu();
    String getTayAo();
    String getCoAo();
    String getChatLieu();

    Integer getQuantity();

    Boolean getStatus();
    BigDecimal getMaxPrice();
    BigDecimal getMinPrice();
    String getDescription();
    String getImages();
//// Sửa thành List<String> để trả về danh sách URL ảnh
//@Value("#{target.images != null ? target.images.![name] : null}")
//List<String> getImages();

    Integer getQuantitySold();
    BigDecimal getDiscountValue();
    BigDecimal getDiscountPercent();

}
