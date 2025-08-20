package com.poly.sport.service;

import com.poly.sport.entity.SanPhamChiTiet;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.FindShoeDetailRequest;
import com.poly.sport.infrastructure.request.SanPhamChiTietRequest;
import com.poly.sport.infrastructure.request.SanPhamChiTietUpdateRequest;
import com.poly.sport.infrastructure.response.SanPhamChiTietReponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface SanPhamChiTietService {
    PhanTrang<SanPhamChiTietReponse> getAll(FindShoeDetailRequest request);
    SanPhamChiTiet getOne(Long id);
    String create(List<SanPhamChiTietRequest> list);
    SanPhamChiTiet update(Long id, SanPhamChiTietUpdateRequest request);
    SanPhamChiTiet delete(Long id);
    ResponseObject updateFast(List<SanPhamChiTietRequest> list);
    PhanTrang<SanPhamChiTietReponse> getAllBillDetail(FindShoeDetailRequest request);
    Map<String, BigDecimal> findMinAndMaxPrice();
    SanPhamChiTietReponse getOneShoeDetail(Long id);
}
