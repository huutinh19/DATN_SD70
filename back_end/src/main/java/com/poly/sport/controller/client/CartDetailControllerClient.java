package com.poly.sport.controller.client;

import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.CartClientRequest;
import com.poly.sport.infrastructure.response.CartResponse;
import com.poly.sport.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client/api/cart")
public class CartDetailControllerClient {
    @Autowired
    private CartService cartService;

    @GetMapping("/{idAccount}")
    public List<CartResponse> get(@PathVariable Long idAccount) {
        return cartService.getListCart(idAccount);
    }

    @PostMapping
    public ResponseObject post(@RequestBody CartClientRequest request){
        return cartService.create(request);
    }

    @PutMapping
    public ResponseObject updateQuantity(@RequestBody CartClientRequest request){
        return cartService.updateQuantity(request);
    }

    @DeleteMapping("/{idCartDetail}")
    public ResponseObject delete(@PathVariable Long idCartDetail){
        return cartService.deleteById(idCartDetail);
    }

    @DeleteMapping("/delete-all/{idAccount}")
    public ResponseObject deleteAll(@PathVariable Long idAccount){
        return cartService.deleteAll(idAccount);
    }
}
