package com.poly.sport.controller.client;


import com.poly.sport.entity.ThuongHieu;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.ThuongHieuRequest;
import com.poly.sport.infrastructure.response.ThuongHieuResponse;
import com.poly.sport.service.ThuongHieuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client/api/brand")
public class ThuongHieuControllerClient {

    @Autowired
    private ThuongHieuService thuongHieuService;

    @GetMapping
    public PhanTrang<ThuongHieuResponse> getAll(ThuongHieuRequest request) {
        return thuongHieuService.getAll(request);
    }

    @GetMapping("/{id}")
    public ThuongHieu getOne(@PathVariable Long id) {
        return thuongHieuService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid ThuongHieuRequest request) {
        return new ResponseObject(thuongHieuService.add(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid ThuongHieuRequest request) {
        return new ResponseObject(thuongHieuService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(thuongHieuService.delete(id));

    }
}
