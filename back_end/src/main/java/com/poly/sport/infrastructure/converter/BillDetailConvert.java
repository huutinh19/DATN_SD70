package com.poly.sport.infrastructure.converter;

import com.poly.sport.entity.Bill;
import com.poly.sport.entity.BillDetail;
import com.poly.sport.entity.KhuyenMaiChiTiet;
import com.poly.sport.entity.SanPhamChiTiet;
import com.poly.sport.infrastructure.request.BillDetailRequest;
import com.poly.sport.repository.IBillRepository;
import com.poly.sport.repository.KhuyenMaiChiTietRepository;
import com.poly.sport.repository.SanPhamChiTietRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BillDetailConvert {
    @Autowired
    private IBillRepository billRepository;
    @Autowired
    private SanPhamChiTietRepository shoeDetailRepository;
    @Autowired
    private KhuyenMaiChiTietRepository khuyenMaiChiTietRepository;
    public BillDetail convertRequestToEntity(BillDetailRequest request) {
        SanPhamChiTiet shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
        Bill bill = billRepository.findById(request.getBill()).get();
        KhuyenMaiChiTiet khuyenMaiChiTiet = khuyenMaiChiTietRepository.findByShoeDetailCode(request.getShoeDetail());
        return BillDetail.builder()
                .shoeDetail(shoeDetail)
                .bill(bill)
                .price(khuyenMaiChiTiet != null ? khuyenMaiChiTiet.getPromotionPrice() : shoeDetail.getPrice())
                .quantity(request.getQuantity())
                .build();
    }

    public BillDetail convertRequestToEntity(BillDetail entity, BillDetailRequest request) {
        SanPhamChiTiet shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
        Bill bill = billRepository.findById(request.getBill()).get();
        KhuyenMaiChiTiet khuyenMaiChiTiet = khuyenMaiChiTietRepository.findByShoeDetailCode(request.getShoeDetail());

        entity.setShoeDetail(shoeDetail);
        entity.setBill(bill);
        entity.setPrice((khuyenMaiChiTiet != null ? khuyenMaiChiTiet.getPromotionPrice() : shoeDetail.getPrice()));
        entity.setQuantity(entity.getQuantity() + request.getQuantity());
        return entity;
    }
}
