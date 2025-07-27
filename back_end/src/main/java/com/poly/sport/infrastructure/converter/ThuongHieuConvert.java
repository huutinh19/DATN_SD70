package com.poly.sport.infrastructure.converter;


import com.poly.sport.entity.ThuongHieu;
import com.poly.sport.infrastructure.request.ThuongHieuRequest;
import org.springframework.stereotype.Component;

@Component
public class ThuongHieuConvert {
    public ThuongHieu addconvertRequest(ThuongHieuRequest request){
        ThuongHieu thuongHieu = ThuongHieu.builder()
                .name(request.getName())
                .build();
        return thuongHieu;
    }
    public ThuongHieu convertRequestToEntity(ThuongHieu entity, ThuongHieuRequest request){
        entity.setName(request.getName());
        return entity;
    }
}
