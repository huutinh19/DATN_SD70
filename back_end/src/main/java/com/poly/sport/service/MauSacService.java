package com.poly.sport.service;

import com.poly.sport.entity.MauSac;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.MauSacRequest;
import com.poly.sport.infrastructure.response.MauSacResponse;


public interface MauSacService {
    PhanTrang<MauSacResponse> getAll(MauSacRequest request);

    MauSac getOne(Long id);
    MauSac create(MauSacRequest request);
    MauSac update(Long id, MauSacRequest request);
    MauSac delete(Long id);
}
