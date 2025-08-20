package com.poly.sport.service;

import com.poly.sport.entity.SanPham;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.FindSanPhamRequest;
import com.poly.sport.infrastructure.request.SanPhamRequest;
import com.poly.sport.infrastructure.response.SanPhamKhuyenMaiRespone;
import com.poly.sport.infrastructure.response.SanPhamResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface SanPhamService {
    PhanTrang<SanPhamResponse> getAll(FindSanPhamRequest request);
    SanPham getOne(Long id);
    SanPham create(SanPhamRequest request);
    SanPham update(Long id,SanPhamRequest request);
    SanPham delete(Long id);
     SanPham changeStatus(Long id);
    List<SanPhamKhuyenMaiRespone> getAllShoeInPromotion(Long promotion);
    List<SanPhamResponse> getTopSell(Integer top);
    List<SanPhamResponse> getTopSellWithDateFilter(Integer top, LocalDateTime startDate, LocalDateTime endDate);
}
