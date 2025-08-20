package com.poly.sport.controller.admin;


import com.poly.sport.entity.KichCo;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.KichCoRequest;
import com.poly.sport.infrastructure.response.KichCoResponse;
import com.poly.sport.service.KichCoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/size")
public class KichThuocController {
    @Autowired
    private KichCoService kichCoService;

    @GetMapping
    public PhanTrang<KichCoResponse> getAll(KichCoRequest request) {
        return kichCoService.getAll(request);
    }

    @GetMapping("/{id}")
    public KichCo getOne(@PathVariable Long id) {
        return kichCoService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid KichCoRequest request) {
        return new ResponseObject(kichCoService.add(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid KichCoRequest request) {
        return new ResponseObject(kichCoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(kichCoService.delete(id));
    }
}
