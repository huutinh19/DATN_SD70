package com.poly.sport.infrastructure.response;

import com.poly.sport.entity.TayAo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = {TayAo.class})
public interface TayAoResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Long getId();
    String getName();
    Boolean getStatus();
    LocalDateTime getCreateAt();
}
