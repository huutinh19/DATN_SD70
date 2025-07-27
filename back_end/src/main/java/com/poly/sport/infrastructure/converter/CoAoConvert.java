package com.poly.sport.infrastructure.converter;

import com.poly.sport.entity.CoAo;
import com.poly.sport.infrastructure.request.CoAoRequest;
import org.springframework.stereotype.Component;

@Component
public class CoAoConvert {
    public CoAo addconvertRequest(CoAoRequest request){
        CoAo coAo = CoAo.builder()
                .name(request.getName())
                .build();
        return coAo;
    }
    public CoAo convertRequestToEntity(CoAo entity, CoAoRequest request){
        entity.setName(request.getName());
        return entity;
    }
}
