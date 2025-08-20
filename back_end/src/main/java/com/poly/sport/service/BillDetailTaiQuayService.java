package com.poly.sport.service;

import com.poly.sport.entity.BillDetail;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.BillDetailRequest;
import com.poly.sport.infrastructure.response.BillDetailResponse;

import java.math.BigDecimal;

public interface BillDetailTaiQuayService {
    PhanTrang<BillDetailResponse> getAll(BillDetailRequest request);

    BillDetail getOne(Long id);
    BillDetail create(BillDetailRequest request);
    BillDetail update(Long id,BillDetailRequest request);
    BillDetail delete(Long id);

    BillDetail updateQuantity(Long id, Integer newQuantity, BigDecimal price);


}
