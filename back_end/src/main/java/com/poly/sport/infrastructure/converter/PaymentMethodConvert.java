package com.poly.sport.infrastructure.converter;

import com.poly.sport.entity.PaymentMethod;
import com.poly.sport.infrastructure.request.PaymentMethodRequest;
import com.poly.sport.repository.IBillRepository;
import com.poly.sport.repository.IPaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PaymentMethodConvert {
    @Autowired
    private IPaymentMethodRepository repository;
    @Autowired
    private IBillRepository billRepository;
    public PaymentMethod convertRequestToEntity(PaymentMethodRequest request){
        return PaymentMethod.builder()
                .method(request.getMethod())
                .totalMoney(request.getTotalMoney())
                .note(request.getNote())
                .tradingCode(request.getTradingCode())
                .bill(billRepository.findById(request.getBill()).orElse(null))
                .type(request.getType())
                .build();
    }
}
