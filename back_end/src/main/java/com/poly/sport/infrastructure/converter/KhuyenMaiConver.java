package com.poly.sport.infrastructure.converter;

import com.poly.sport.entity.KhuyenMai;
import com.poly.sport.infrastructure.request.KhuyenMaiRequest;
import com.poly.sport.repository.KhuyenMaiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class KhuyenMaiConver {
    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;

    public KhuyenMai convertRequestToEntity(KhuyenMaiRequest request){
        return KhuyenMai.builder()
                .code(request.getCode())
                .name(request.getName())
                .value(request.getValue())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus())
                .build();
    }

    public KhuyenMai convertRequestToEntity(KhuyenMai khuyenMai, KhuyenMaiRequest request){
        khuyenMai.setCode(request.getCode());
        khuyenMai.setName(request.getName());
        khuyenMai.setValue(request.getValue());
        khuyenMai.setStartDate(request.getStartDate());
        khuyenMai.setEndDate(request.getEndDate());
        khuyenMai.setStatus(request.getStatus());
        return khuyenMai;
    }
}
