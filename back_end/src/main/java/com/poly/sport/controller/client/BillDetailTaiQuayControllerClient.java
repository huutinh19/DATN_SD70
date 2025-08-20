package com.poly.sport.controller.client;

import com.poly.sport.entity.BillDetail;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.BillDetailRequest;
import com.poly.sport.infrastructure.response.BillDetailResponse;
import com.poly.sport.service.BillDetailTaiQuayService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/client/api/bill-detail-taiquay")
public class BillDetailTaiQuayControllerClient {
    @Autowired
    private BillDetailTaiQuayService billDetailTaiQuayService;

    @GetMapping
    public PhanTrang<BillDetailResponse> getAll(BillDetailRequest request) {
        return billDetailTaiQuayService.getAll(request);
    }

    @GetMapping("/{id}")
    public BillDetail getOne(@PathVariable Long id) {
        return billDetailTaiQuayService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid BillDetailRequest request) {
        return new ResponseObject(billDetailTaiQuayService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject create(@PathVariable Long id, @RequestBody @Valid BillDetailRequest request) {
        return new ResponseObject(billDetailTaiQuayService.update(id, request));
    }

    @GetMapping("/update-quantity/{id}")
    public ResponseObject updateQuantity(@PathVariable Long id, @RequestParam(required = false, defaultValue = "0") Integer newQuantity, @RequestParam(required = false) BigDecimal price) {
        return new ResponseObject(billDetailTaiQuayService.updateQuantity(id, newQuantity, price));
    }


    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id){
        return new ResponseObject(billDetailTaiQuayService.delete(id));
    }

}