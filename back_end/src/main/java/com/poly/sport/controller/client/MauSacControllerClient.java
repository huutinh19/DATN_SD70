package com.poly.sport.controller.client;

import com.poly.sport.entity.MauSac;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.MauSacRequest;
import com.poly.sport.infrastructure.response.MauSacResponse;
import com.poly.sport.service.MauSacService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client/api/color")
public class MauSacControllerClient {

    @Autowired
    private MauSacService service;


    @GetMapping
    public PhanTrang<MauSacResponse> getAll(MauSacRequest request) {
        return service.getAll(request);
    }

    @GetMapping("/{id}")
    public MauSac getOne(@PathVariable Long id) {
        return service.getOne(id);
    }

    @PostMapping
    public ResponseObject add(@RequestBody @Valid MauSacRequest request) {
        return new ResponseObject(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid MauSacRequest request) {
        return new ResponseObject(service.update(id, request));
    }


    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id){
        return new ResponseObject(service.delete(id));
    }
}
