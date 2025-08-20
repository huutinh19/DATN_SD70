package com.poly.sport.controller.client;

import com.poly.sport.entity.TayAo;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.TayAoRequest;
import com.poly.sport.infrastructure.response.TayAoResponse;
import com.poly.sport.service.TayAoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client/api/tayao")
public class TayAoControllerClient {
    @Autowired
    private TayAoService tayAoService;

    @GetMapping
    public PhanTrang<TayAoResponse> getAll(TayAoRequest request) {
        return tayAoService.getAll(request);
    }

    @GetMapping("/{id}")
    public TayAo getOne(@PathVariable Long id) {
        return tayAoService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid TayAoRequest request) {
        return new ResponseObject(tayAoService.add(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid TayAoRequest request) {
        return new ResponseObject(tayAoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(tayAoService.delete(id));

    }
}
