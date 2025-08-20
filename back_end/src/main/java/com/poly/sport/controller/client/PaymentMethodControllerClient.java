package com.poly.sport.controller.client;

import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.PaymentMethodRequest;
import com.poly.sport.infrastructure.response.PaymentMethodResponse;
import com.poly.sport.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client/api/payment-method")
public class PaymentMethodControllerClient {
    @Autowired
    private PaymentMethodService service;
    @GetMapping("/{id}")
    public List<PaymentMethodResponse> getAll(@PathVariable Long id){
        return service.getByBill(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody PaymentMethodRequest request){
        return service.create(request);
    }
}
