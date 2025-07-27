package com.poly.sport.service;

import com.poly.sport.entity.KichCo;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.KichCoRequest;
import com.poly.sport.infrastructure.response.KichCoResponse;

public interface KichCoService {
    PhanTrang<KichCoResponse> getAll(KichCoRequest request);

    KichCo getOne(Long id);

    KichCo add(KichCoRequest request);

    KichCo update(Long id, KichCoRequest request);

    KichCo delete(Long id);



}
