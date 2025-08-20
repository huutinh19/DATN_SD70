package com.poly.sport.controller.client;


import com.poly.sport.entity.Voucher;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.VoucherRequest;
import com.poly.sport.service.VoucherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/client/api/voucher")
public class VoucherControllerClient {
    @Autowired
    private VoucherService voucherService;

    @GetMapping
    public PhanTrang getAll(final VoucherRequest request) {
        return voucherService.getAll(request);
    }

    @PostMapping("add")
    public ResponseObject addVoucher(@ModelAttribute @Valid VoucherRequest request) {

        return new ResponseObject(voucherService.add(request));

    }

    @PutMapping("/update/{id}")
    public ResponseObject updateVocher(@ModelAttribute @Valid VoucherRequest request, @PathVariable Long id) {

        return new ResponseObject(voucherService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getOne(@PathVariable Long id) {
        return new ResponseEntity<>(voucherService.getOne(id), HttpStatus.OK);
    }

    @PutMapping("/update/end-date/{id}")
    public ResponseObject updateEndDate( @PathVariable Long id) {
        return new ResponseObject(voucherService.updateEndDate(id));
    }
}