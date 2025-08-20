package com.poly.sport.service;

import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.PaymentMethodRequest;
import com.poly.sport.infrastructure.response.PaymentMethodResponse;

import java.util.List;

public interface PaymentMethodService {
    List<PaymentMethodResponse> getByBill(Long idBill);
    ResponseObject create(PaymentMethodRequest request);
}
