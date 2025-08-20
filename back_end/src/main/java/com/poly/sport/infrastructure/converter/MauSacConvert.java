package com.poly.sport.infrastructure.converter;


import com.poly.sport.entity.MauSac;
import com.poly.sport.infrastructure.request.MauSacRequest;
import org.springframework.stereotype.Component;

@Component
public class MauSacConvert {

    public MauSac addconvertRequest(MauSacRequest request){
        MauSac mauSac = MauSac.builder()
                .name(request.getName())
                .build();
        return mauSac;
    }

    public MauSac convertRequestToEntity(MauSac entity, MauSacRequest request){
        entity.setName(request.getName());
        return entity;
    }
}
