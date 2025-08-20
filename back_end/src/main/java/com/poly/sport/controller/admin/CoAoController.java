package com.poly.sport.controller.admin;

import com.poly.sport.entity.CoAo;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.CoAoRequest;
import com.poly.sport.infrastructure.response.CoAoResponse;
import com.poly.sport.service.CoAoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coao")
public class CoAoController {
    @Autowired
    private CoAoService coAoService;

    @GetMapping
    public PhanTrang<CoAoResponse> getAll(CoAoRequest request) {
        return coAoService.getAll(request);
    }

    @GetMapping("/{id}")
    public CoAo getOne(@PathVariable Long id) {
        return coAoService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid CoAoRequest request) {
        return new ResponseObject(coAoService.add(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid CoAoRequest request) {
        return new ResponseObject(coAoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(coAoService.delete(id));

    }
}
