package com.poly.sport.infrastructure.converter;


import com.poly.sport.entity.KichCo;
import com.poly.sport.infrastructure.request.KichCoRequest;
import org.springframework.stereotype.Component;

@Component
public class KichCoConvert {

    public KichCo addconvertRequest(KichCoRequest request){
        KichCo kichCo = KichCo.builder()
                .name(request.getName())
                .build();
        return kichCo;
    }
    public KichCo convertRequestToEntity(KichCo entity, KichCoRequest request){
        entity.setName(request.getName());
        return entity;
    }

}
