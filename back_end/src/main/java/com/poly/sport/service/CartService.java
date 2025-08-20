package com.poly.sport.service;


import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.CartClientRequest;
import com.poly.sport.infrastructure.response.CartResponse;

import java.util.List;

public interface CartService {
    List<CartResponse> getListCart(Long idAccount);
    ResponseObject create(CartClientRequest request);
    ResponseObject updateQuantity(CartClientRequest request);
    ResponseObject deleteById(Long idCartDetail);
    ResponseObject deleteAll(Long idAccount);
}
