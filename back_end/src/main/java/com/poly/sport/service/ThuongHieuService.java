package com.poly.sport.service;


import com.poly.sport.entity.ThuongHieu;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.ThuongHieuRequest;
import com.poly.sport.infrastructure.response.ThuongHieuResponse;

public interface ThuongHieuService {
    PhanTrang<ThuongHieuResponse> getAll(ThuongHieuRequest request);

    ThuongHieu getOne(Long id);

    ThuongHieu add(ThuongHieuRequest request);

    ThuongHieu update(Long id, ThuongHieuRequest request);

    ThuongHieu delete(Long id);

}
