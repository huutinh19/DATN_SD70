
package com.poly.sport.service.impl;

import com.poly.sport.entity.CartDetail;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.CartClientRequest;
import com.poly.sport.repository.ICartDetailRepository;
import com.poly.sport.service.CartDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartDetailServiceImpl implements CartDetailService {
    @Autowired
    private ICartDetailRepository cartDetailRepository;

    @Override
    public Boolean deleteCartDetail(Long id) {
        cartDetailRepository.deleteById(id);
        return true;
    }

    @Override
    public String changeQuantity(CartClientRequest cartClientRequest) {
        CartDetail cartDetail = cartDetailRepository.findById(cartClientRequest.getId())
                .orElseThrow(() -> new NgoaiLe("Chi tiết giỏ hàng không tồn tại!"));

        // Kiểm tra trạng thái deleted của sản phẩm
        if (cartDetail.getShoeDetail().getShoe().getDeleted()) {
            throw new NgoaiLe("Sản phẩm đã ngừng bán!");
        }

        cartDetail.setQuantity(cartClientRequest.getQuantity());
        cartDetailRepository.save(cartDetail);
        return "ok";
    }
}