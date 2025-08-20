package com.poly.sport.service;

import com.poly.sport.entity.KhuyenMai;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.KhuyenMaiRequest;
import com.poly.sport.infrastructure.response.KhuyenMaiResponse;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KhuyenMaiService {
    PhanTrang<KhuyenMaiResponse> getAll(KhuyenMaiRequest request);
    ResponseObject create(KhuyenMaiRequest request);
    ResponseObject update(Long id,KhuyenMaiRequest request);
    KhuyenMaiResponse getOne(Long id);
    List<Long> getListIdShoePromotion(Long idPromotion);
    List<Long> getListIdShoeDetailInPromotion(@Param("idPromotion") Long idPromotion);
    void deleteAll(Long idPromotion);
    void updateStatusPromotion();
    KhuyenMai updateEndDate(Long id);
    boolean isCodeUnique(String code);
    List<Long> getAllActiveShoeDetailIds();
}
