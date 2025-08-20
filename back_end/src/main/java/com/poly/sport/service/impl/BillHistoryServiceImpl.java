package com.poly.sport.service.impl;

import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.converter.BillHistoryConvert;
import com.poly.sport.infrastructure.request.BillHistoryRequest;
import com.poly.sport.infrastructure.response.BillHistoryResponse;
import com.poly.sport.repository.IBillHistoryRepository;
import com.poly.sport.service.BillHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillHistoryServiceImpl implements BillHistoryService {
    @Autowired
    private IBillHistoryRepository repository;
    @Autowired
    private BillHistoryConvert billHistoryConvert;

    @Override
    public List<BillHistoryResponse> getByBill(Long idBill) {
        return repository.getByBill(idBill);
    }

    @Override
    public ResponseObject create(BillHistoryRequest request) {
        return new ResponseObject(billHistoryConvert.convertRequestToEntity(request));
    }
}
