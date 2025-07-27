package com.poly.sport.service;

import com.poly.sport.entity.TayAo;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.TayAoRequest;
import com.poly.sport.infrastructure.response.TayAoResponse;

public interface TayAoService {
    PhanTrang<TayAoResponse> getAll(TayAoRequest request);

    TayAo getOne(Long id);

    TayAo add(TayAoRequest request);

    TayAo update(Long id, TayAoRequest request);

    TayAo delete(Long id);
}
