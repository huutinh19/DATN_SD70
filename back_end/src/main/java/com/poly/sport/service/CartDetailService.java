package com.poly.sport.service;


import com.poly.sport.infrastructure.request.CartClientRequest;

public interface CartDetailService {
    Boolean deleteCartDetail(Long id);

    String changeQuantity(CartClientRequest cartClientRequest);
}
