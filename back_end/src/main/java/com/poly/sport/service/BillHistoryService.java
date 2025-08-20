package com.poly.sport.service;

import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.BillHistoryRequest;
import com.poly.sport.infrastructure.response.BillHistoryResponse;

import java.util.List;

public interface BillHistoryService {
    List<BillHistoryResponse> getByBill(Long idBill);
    ResponseObject create(BillHistoryRequest request);
}

