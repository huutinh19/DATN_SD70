package com.poly.sport.service;

import com.poly.sport.entity.XuatXu;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.XuatXuRequest;
import com.poly.sport.infrastructure.response.XuatXuResponse;

public interface XuatXuService {
    PhanTrang<XuatXuResponse> getAll(XuatXuRequest request);

    XuatXu getOne(Long id);

    XuatXu add(XuatXuRequest request);

    XuatXu update(Long id, XuatXuRequest request);

    XuatXu delete(Long id);
}
