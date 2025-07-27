package com.poly.sport.service;

import com.poly.sport.entity.CoAo;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.CoAoRequest;
import com.poly.sport.infrastructure.response.CoAoResponse;

public interface CoAoService {
    PhanTrang<CoAoResponse> getAll(CoAoRequest request);

    CoAo getOne(Long id);

    CoAo add(CoAoRequest request);

    CoAo update(Long id, CoAoRequest request);

    CoAo delete(Long id);
}
