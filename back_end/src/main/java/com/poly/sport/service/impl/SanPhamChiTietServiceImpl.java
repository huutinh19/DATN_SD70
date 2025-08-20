




package com.poly.sport.service.impl;

import com.poly.sport.entity.KhuyenMaiChiTiet;
import com.poly.sport.entity.SanPham;
import com.poly.sport.entity.SanPhamChiTiet;
import com.poly.sport.infrastructure.common.GenCode;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.converter.SanPhamChiTietConvert;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.FindShoeDetailRequest;
import com.poly.sport.infrastructure.request.SanPhamChiTietRequest;
import com.poly.sport.infrastructure.request.SanPhamChiTietUpdateRequest;
import com.poly.sport.infrastructure.response.SanPhamChiTietReponse;
import com.poly.sport.repository.*;
import com.poly.sport.service.KhuyenMaiService;
import com.poly.sport.service.SanPhamChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class SanPhamChiTietServiceImpl implements SanPhamChiTietService {
    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private MauSacRepository mauSacRepository;
    @Autowired
    private KichCoRepository kichCoRepository;
    @Autowired
    private AnhRepository anhRepository;
    @Autowired
    private SanPhamChiTietConvert sanPhamChiTietConvert;
    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;
    @Autowired
    private KhuyenMaiChiTietRepository khuyenMaiChiTietRepository;
    @Autowired
    private KhuyenMaiService khuyenMaiService; // Thêm dependency

    public PhanTrang<SanPhamChiTietReponse> getAll(FindShoeDetailRequest request) {
        khuyenMaiService.updateStatusPromotion(); // Cập nhật trạng thái promotion trước khi lấy danh sách
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        FindShoeDetailRequest customRequest = FindShoeDetailRequest.builder()
                .colors(request.getColor() != null ? Arrays.asList(request.getColor().split(",")) : null)
                .shoes(request.getShoe() != null ? Arrays.asList(request.getShoe().split(",")) : null)
                .sizes(request.getSize() != null ? Arrays.asList(request.getSize().split(",")) : null)
                .xuatXus(request.getXuatXu() != null ? Arrays.asList(request.getXuatXu().split(",")) : null)
                .thuongHieus(request.getThuongHieu() != null ? Arrays.asList(request.getThuongHieu().split(",")) : null)
                .coAos(request.getCoAo() != null ? Arrays.asList(request.getCoAo().split(",")) : null)
                .tayAos(request.getTayAo() != null ? Arrays.asList(request.getTayAo().split(",")) : null)
                .chatLieus(request.getChatLieu() != null ? Arrays.asList(request.getChatLieu().split(",")) : null)
                .size(request.getSize())
                .color(request.getColor())
                .shoe(request.getShoe())
                .xuatXu(request.getXuatXu())
                .thuongHieu(request.getThuongHieu())
                .coAo(request.getCoAo())
                .tayAo(request.getTayAo())
                .chatLieu(request.getChatLieu())
                .name(request.getName())
                .build();
        return new PhanTrang<>(sanPhamChiTietRepository.getAll(customRequest, pageable));
    }

    public PhanTrang<SanPhamChiTietReponse> getAllBillDetail(FindShoeDetailRequest request) {
        khuyenMaiService.updateStatusPromotion(); // Cập nhật trạng thái promotion trước khi lấy danh sách
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        FindShoeDetailRequest customRequest = FindShoeDetailRequest.builder()
                .colors(request.getColor() != null ? Arrays.asList(request.getColor().split(",")) : null)
                .shoes(request.getShoe() != null ? Arrays.asList(request.getShoe().split(",")) : null)
                .sizes(request.getSize() != null ? Arrays.asList(request.getSize().split(",")) : null)
                .xuatXus(request.getXuatXu() != null ? Arrays.asList(request.getXuatXu().split(",")) : null)
                .thuongHieus(request.getThuongHieu() != null ? Arrays.asList(request.getThuongHieu().split(",")) : null)
                .coAos(request.getCoAo() != null ? Arrays.asList(request.getCoAo().split(",")) : null)
                .tayAos(request.getTayAo() != null ? Arrays.asList(request.getTayAo().split(",")) : null)
                .chatLieus(request.getChatLieu() != null ? Arrays.asList(request.getChatLieu().split(",")) : null)
                .size(request.getSize())
                .color(request.getColor())
                .shoe(request.getShoe())
                .xuatXu(request.getXuatXu())
                .thuongHieu(request.getThuongHieu())
                .coAo(request.getCoAo())
                .tayAo(request.getTayAo())
                .chatLieu(request.getChatLieu())
                .name(request.getName())
                .build();
        return new PhanTrang<>(sanPhamChiTietRepository.getAllBillDetail(customRequest, pageable));
    }

    public SanPhamChiTiet getOne(Long id) {
        return sanPhamChiTietRepository.findById(id).orElse(null);
    }

    @Transactional
    public String create(List<SanPhamChiTietRequest> list) {
        for (SanPhamChiTietRequest request : list) {
            SanPhamChiTiet convert = sanPhamChiTietConvert.convertRequestToEntity(request);
            SanPhamChiTiet check = sanPhamChiTietRepository.findByShoeIdAndColorIdAndSizeId(request.getShoe(), request.getColor(), request.getSize());
            if (check != null) {
                check.setQuantity(check.getQuantity() + request.getQuantity());
                sanPhamChiTietRepository.save(check);
            } else {
                SanPhamChiTiet sanPhamChiTietsave = sanPhamChiTietRepository.save(convert);
                SanPham sanPham = sanPhamChiTietsave.getShoe();
                sanPham.setUpdateAt(LocalDateTime.now());
                sanPhamRepository.save(sanPham);
            }
        }
        return "Thêm thành công!";
    }

    public SanPhamChiTiet update(Long id, SanPhamChiTietUpdateRequest request) {
        SanPhamChiTiet old = sanPhamChiTietRepository.findById(id)
                .orElseThrow(() -> new NgoaiLe("Không tìm thấy sản phẩm!"));

        String newCode = GenCode.genCodeByName(old.getShoe().getCode() + "-" + request.getColor() + request.getSize());
        if (!newCode.equals(old.getCode()) && sanPhamChiTietRepository.existsByCode(newCode)) {
            throw new NgoaiLe("Phiên bản này đã tồn tại!");
        }

        // Cập nhật thông tin
        old.setPrice(request.getPrice());
        old.setWeight(request.getWeight());
        old.setQuantity(request.getQuantity());
        old.setSize(kichCoRepository.findByName(request.getSize()));
        old.setColor(mauSacRepository.findByName(request.getColor()));
        old.setCode(newCode);

        // Kiểm tra và cập nhật giá khuyến mãi nếu SPCT đang trong promotion
        KhuyenMaiChiTiet promotionDetail = khuyenMaiChiTietRepository.findByShoeDetailId(id);
        if (promotionDetail != null && promotionDetail.getPromotion().getStatus() == 1) {
            BigDecimal newPromotionPrice = request.getPrice().subtract(
                    request.getPrice().divide(new BigDecimal("100")).multiply(new BigDecimal(promotionDetail.getPromotion().getValue()))
            );
            promotionDetail.setPromotionPrice(newPromotionPrice);
            khuyenMaiChiTietRepository.save(promotionDetail);
        }

        // Cập nhật trạng thái dựa trên deleted từ request hoặc quantity = 0
        boolean isDeleted = request.getDeleted() != null ? request.getDeleted() : request.getQuantity() == 0;
        old.setDeleted(isDeleted);
        SanPham sanPham = old.getShoe();
        // Cập nhật trạng thái sản phẩm chính nếu tất cả chi tiết đều ngừng bán
        List<SanPhamChiTiet> details = sanPhamChiTietRepository.findByShoe(sanPham);
        boolean allDetailsDeleted = details.stream().allMatch(SanPhamChiTiet::getDeleted);
        sanPham.setDeleted(allDetailsDeleted);
        sanPhamRepository.save(sanPham);

        return sanPhamChiTietRepository.save(old);
    }
    public ResponseObject updateFast(List<SanPhamChiTietRequest> list) {
        for (SanPhamChiTietRequest request : list) {
            SanPhamChiTiet convert = sanPhamChiTietConvert.convertRequestToEntityFast(sanPhamChiTietRepository.findById(request.getId()).get(), request);
            sanPhamChiTietRepository.save(convert);
        }
        return new ResponseObject(list);
    }

    public SanPhamChiTietReponse getOneShoeDetail(Long id) {
        khuyenMaiService.updateStatusPromotion(); // Cập nhật trạng thái promotion trước khi lấy chi tiết
        return sanPhamChiTietRepository.getOneShoeDetail(id);
    }

    public Map<String, BigDecimal> findMinAndMaxPrice() {
        return sanPhamChiTietRepository.findMinAndMaxPrice();
    }

    public SanPhamChiTiet delete(Long id) {
        return null;
    }
}