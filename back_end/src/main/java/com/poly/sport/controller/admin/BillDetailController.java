package com.poly.sport.controller.admin;

import com.poly.sport.entity.BillDetail;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.BillDetailRequest;
import com.poly.sport.infrastructure.response.BillDetailResponse;
import com.poly.sport.service.BillDetailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/bill-detail")
public class BillDetailController {
    @Autowired
    private BillDetailService billDetailService;

    @GetMapping
    public PhanTrang<BillDetailResponse> getAll(BillDetailRequest request) {
        return billDetailService.getAll(request);
    }

    @GetMapping("/{id}")
    public BillDetail getOne(@PathVariable Long id) {
        return billDetailService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid BillDetailRequest request) {
        return new ResponseObject(billDetailService.create(request));
    }

//    @PutMapping("/{id}")
//    public ResponseObject create(@PathVariable Long id, @RequestBody @Valid BillDetailRequest request) {
//        return new ResponseObject(billDetailService.update(id, request));
//    }

    @GetMapping("/update-quantity/{id}")
    public ResponseObject updateQuantity(@PathVariable Long id, @RequestParam(required = false, defaultValue = "0") Integer newQuantity, @RequestParam(required = false) BigDecimal price) {
        return new ResponseObject(billDetailService.updateQuantity(id, newQuantity, price));
    }


    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id){
        return new ResponseObject(billDetailService.delete(id));
    }
    @GetMapping("/latest-discount-percent")
    public ResponseEntity<Float> getLatestDiscountPercent(@RequestParam String shoeDetailCode, @RequestParam Long billId) {
        Float discountPercent = billDetailService.getLatestDiscountPercent(shoeDetailCode, billId);
        return ResponseEntity.ok(discountPercent);
    }
}