package com.poly.sport.infrastructure.converter;

import com.poly.sport.entity.Voucher;
import com.poly.sport.infrastructure.request.VoucherRequest;
import com.poly.sport.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class VoucherConvert {

    @Autowired
    private VoucherRepository voucherRepository;
    public Voucher converRequestToEntity(VoucherRequest request){
        return Voucher.builder()
                .code(request.getCode())
                .name(request.getName())
                .quantity(request.getQuantity())
                .percentReduce(Float.valueOf(request.getPercentReduce()))
                .minBillValue(new BigDecimal(request.getMinBillValue().toString()))
                .maxBillValue(new BigDecimal(request.getMaxBillValue().toString()))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
    }
    public Voucher convertRequestToEntity(Long id, VoucherRequest request){
        Voucher voucher = voucherRepository.findById(id).get();
        voucher.setName(request.getName());
        voucher.setQuantity(request.getQuantity());
        voucher.setPercentReduce(Float.valueOf(request.getPercentReduce()));
        voucher.setMinBillValue(new BigDecimal(request.getMinBillValue().toString()));
        voucher.setMaxBillValue(new BigDecimal(request.getMaxBillValue().toString()));
//        voucher.setCode(request.getCode());
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        return voucher;
    }
}