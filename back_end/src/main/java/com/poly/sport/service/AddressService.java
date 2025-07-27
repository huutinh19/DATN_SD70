package com.poly.sport.service;

import com.poly.sport.entity.Address;
import com.poly.sport.infrastructure.request.AddressRequest;
import com.poly.sport.infrastructure.response.AddressResponse;
import org.springframework.data.domain.Page;

public interface AddressService {
    Page<AddressResponse> getByAccount(AddressRequest request);

    Address create(AddressRequest request);

    Address update(Long idAddress, AddressRequest request);

    Address delete(Long idAddress);
}
