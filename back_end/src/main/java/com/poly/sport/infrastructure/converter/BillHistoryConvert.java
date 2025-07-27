package com.poly.sport.infrastructure.converter;

import com.poly.sport.entity.BillHistory;
import com.poly.sport.infrastructure.request.BillHistoryRequest;
import com.poly.sport.repository.IBillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BillHistoryConvert {
    @Autowired
    private IBillRepository billRepository;

    public BillHistory convertRequestToEntity(BillHistoryRequest request) {
        return BillHistory.builder()
                .bill(billRepository.findById(request.getIdBill()).get())
                .note(request.getNote())
                .status(request.getStatus())
                .build();
    }
}
