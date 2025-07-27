package com.poly.sport.infrastructure.response;


import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface KhuyenMaiResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Long getId();
    String getCode();
    String getName();
    BigDecimal getValue();
    Boolean getType();
    LocalDateTime getStartDate();
    LocalDateTime getEndDate();
    Integer getStatus();
}
