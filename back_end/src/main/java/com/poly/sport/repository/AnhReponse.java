package com.poly.sport.repository;

import com.poly.sport.entity.Images;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Images.class})
public interface AnhReponse {
    Long getId();

    String getName();
}
