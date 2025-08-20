package com.poly.sport.controller.admin;

import com.poly.sport.entity.XuatXu;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.XuatXuRequest;
import com.poly.sport.infrastructure.response.XuatXuResponse;
import com.poly.sport.service.XuatXuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/xuatxu")
public class XuatXuController {
    @Autowired
    private XuatXuService xuatXuService;

    @GetMapping
    public PhanTrang<XuatXuResponse> getAll(XuatXuRequest request) {
        return xuatXuService.getAll(request);
    }

    @GetMapping("/{id}")
    public XuatXu getOne(@PathVariable Long id) {
        return xuatXuService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid XuatXuRequest request) {
        return new ResponseObject(xuatXuService.add(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid XuatXuRequest request) {
        return new ResponseObject(xuatXuService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(xuatXuService.delete(id));

    }
}
