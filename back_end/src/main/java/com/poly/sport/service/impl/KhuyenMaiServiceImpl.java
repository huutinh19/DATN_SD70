package com.poly.sport.service.impl;

import com.poly.sport.entity.KhuyenMai;
import com.poly.sport.entity.KhuyenMaiChiTiet;
import com.poly.sport.entity.SanPhamChiTiet;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.converter.KhuyenMaiConver;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.KhuyenMaiRequest;
import com.poly.sport.infrastructure.response.KhuyenMaiResponse;
import com.poly.sport.repository.KhuyenMaiChiTietRepository;
import com.poly.sport.repository.KhuyenMaiRepository;
import com.poly.sport.repository.SanPhamChiTietRepository;
import com.poly.sport.service.KhuyenMaiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class KhuyenMaiServiceImpl implements KhuyenMaiService {
    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;

    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;

    @Autowired
    private KhuyenMaiChiTietRepository khuyenMaiChiTietRepository;

    @Autowired
    private KhuyenMaiConver khuyenMaiConver;

    public PhanTrang<KhuyenMaiResponse> getAll(KhuyenMaiRequest request) {
        return new PhanTrang<>(khuyenMaiRepository.getAllPromotion(request, PageRequest.of(request.getPage()-1, request.getSizePage())));
    }

    public boolean isCodeUnique(String code) {
        Optional<KhuyenMai> existingPromotion = khuyenMaiRepository.findByCode(code);
        return existingPromotion.isEmpty();
    }

    public void updateStatusPromotion() {
        LocalDateTime currentDateTime = LocalDateTime.now();
        List<KhuyenMai> khuyenMais = khuyenMaiRepository.findAll();
        for (KhuyenMai promotion : khuyenMais) {
            LocalDateTime startDate = promotion.getStartDate();
            LocalDateTime endDate = promotion.getEndDate();
            if (currentDateTime.isBefore(startDate)) {
                promotion.setStatus(0); // Chưa bắt đầu
            } else if (currentDateTime.isAfter(startDate) && currentDateTime.isBefore(endDate)) {
                promotion.setStatus(1); // Đang diễn ra
            } else {
                promotion.setStatus(2); // Đã kết thúc
            }
            if (endDate.isEqual(startDate)) {
                promotion.setStatus(2); // Đã kết thúc
            }
            khuyenMaiRepository.save(promotion);
        }
    }

    @Transactional(rollbackFor = NgoaiLe.class)
    public ResponseObject create(KhuyenMaiRequest request) {
        // Các kiểm tra cơ bản
        if (request.getCode().length() > 20) {
            throw new NgoaiLe("Mã đợt giảm giá không được vượt quá 20 kí tự.");
        }
        if (!isCodeUnique(request.getCode())) {
            throw new NgoaiLe("Mã đợt giảm giá đã tồn tại");
        }
        if (request.getName().length() > 50) {
            throw new NgoaiLe("Tên đợt giảm giá không được vượt quá 50 kí tự.");
        }
        if (request.getValue() < 1 || request.getValue() > 50) {
            throw new NgoaiLe("Vui lòng nhập giá trị (%) hợp lệ!");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new NgoaiLe("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
        if (request.getStartDate().isEqual(request.getEndDate())) {
            throw new NgoaiLe("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }
        if (request.getStartDate().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
            throw new NgoaiLe("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
        }

        // Kiểm tra SPCT có đang trong promotion hoạt động không
        for (Long shoeDetailId : request.getProductDetails()) {
            boolean isInActivePromotion = khuyenMaiChiTietRepository.existsByShoeDetailIdAndActivePromotion(shoeDetailId);
            if (isInActivePromotion) {
                SanPhamChiTiet shoeDetail = sanPhamChiTietRepository.findById(shoeDetailId)
                        .orElseThrow(() -> new NgoaiLe("Sản phẩm chi tiết không tồn tại"));
                throw new NgoaiLe("Sản phẩm '" + shoeDetail.getCode() + "' đang tham gia một đợt giảm giá khác còn hoạt động!");
            }
        }

        // Tạo mới đợt giảm giá
        KhuyenMai promotionSave = khuyenMaiRepository.save(khuyenMaiConver.convertRequestToEntity(request));

        // Tạo các chi tiết khuyến mãi mới
        for (Long shoeDetailId : request.getProductDetails()) {
            // Xóa bản ghi cũ của SPCT nếu có (chỉ từ promotion đã kết thúc)
            KhuyenMaiChiTiet existingDetail = khuyenMaiChiTietRepository.findByShoeDetailId(shoeDetailId);
            if (existingDetail != null && existingDetail.getPromotion().getStatus() == 2) {
                khuyenMaiChiTietRepository.delete(existingDetail);
            }

            SanPhamChiTiet shoeDetail = sanPhamChiTietRepository.findById(shoeDetailId)
                    .orElseThrow(() -> new NgoaiLe("Sản phẩm chi tiết không tồn tại"));
            KhuyenMaiChiTiet khuyenMaiChiTiet = new KhuyenMaiChiTiet();
            khuyenMaiChiTiet.setPromotion(promotionSave);
            khuyenMaiChiTiet.setShoeDetail(shoeDetail);
            khuyenMaiChiTiet.setPromotionPrice(shoeDetail.getPrice().subtract(
                    (shoeDetail.getPrice().divide(new BigDecimal("100"))).multiply(new BigDecimal(request.getValue()))
            ));
            khuyenMaiChiTietRepository.save(khuyenMaiChiTiet);
        }
        updateStatusPromotion();
        return new ResponseObject(request);
    }

    @Transactional(rollbackFor = NgoaiLe.class)
    public ResponseObject update(Long id, KhuyenMaiRequest request) {
        KhuyenMai promotion = khuyenMaiRepository.findById(id)
                .orElseThrow(() -> new NgoaiLe("Đợt giảm giá không tồn tại"));

        // Các kiểm tra cơ bản
        if (request.getCode().length() > 20) {
            throw new NgoaiLe("Mã đợt giảm giá không được vượt quá 20 kí tự.");
        }
        if (!promotion.getCode().equalsIgnoreCase(request.getCode()) && !isCodeUnique(request.getCode())) {
            throw new NgoaiLe("Mã đợt giảm giá đã tồn tại");
        }
        if (request.getName().length() > 50) {
            throw new NgoaiLe("Tên đợt giảm giá không được vượt quá 50 kí tự.");
        }
        if (request.getValue() < 1 || request.getValue() > 50) {
            throw new NgoaiLe("Vui lòng nhập giá trị (%) hợp lệ!");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new NgoaiLe("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
        if (request.getStartDate().isEqual(request.getEndDate())) {
            throw new NgoaiLe("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }

        // Kiểm tra SPCT có đang trong promotion hoạt động khác không
        for (Long shoeDetailId : request.getProductDetails()) {
            KhuyenMaiChiTiet existingDetail = khuyenMaiChiTietRepository.findByShoeDetailId(shoeDetailId);
            if (existingDetail != null && !existingDetail.getPromotion().getId().equals(id)) {
                boolean isInActivePromotion = khuyenMaiChiTietRepository.existsByShoeDetailIdAndActivePromotion(shoeDetailId);
                if (isInActivePromotion) {
                    SanPhamChiTiet shoeDetail = sanPhamChiTietRepository.findById(shoeDetailId)
                            .orElseThrow(() -> new NgoaiLe("Sản phẩm chi tiết không tồn tại"));
                    throw new NgoaiLe("Sản phẩm '" + shoeDetail.getCode() + "' đang tham gia một đợt giảm giá khác chưa kết thúc!");
                }
            }
        }

        // Xóa tất cả bản ghi cũ của promotion hiện tại
        deleteAll(id);

        // Cập nhật thông tin đợt giảm giá
        KhuyenMai promotionSave = khuyenMaiRepository.save(khuyenMaiConver.convertRequestToEntity(promotion, request));

        // Tạo lại các chi tiết khuyến mãi mới
        for (Long shoeDetailId : request.getProductDetails()) {
            // Xóa bản ghi cũ của SPCT nếu có (chỉ từ promotion đã kết thúc)
            KhuyenMaiChiTiet existingDetail = khuyenMaiChiTietRepository.findByShoeDetailId(shoeDetailId);
            if (existingDetail != null && existingDetail.getPromotion().getStatus() == 2) {
                khuyenMaiChiTietRepository.delete(existingDetail);
            }

            SanPhamChiTiet shoeDetail = sanPhamChiTietRepository.findById(shoeDetailId)
                    .orElseThrow(() -> new NgoaiLe("Sản phẩm chi tiết không tồn tại"));
            KhuyenMaiChiTiet promotionDetail = new KhuyenMaiChiTiet();
            promotionDetail.setPromotion(promotionSave);
            promotionDetail.setShoeDetail(shoeDetail);
            promotionDetail.setPromotionPrice(shoeDetail.getPrice().subtract(
                    (shoeDetail.getPrice().divide(new BigDecimal("100"))).multiply(new BigDecimal(request.getValue()))
            ));
            khuyenMaiChiTietRepository.save(promotionDetail);
        }

        updateStatus(promotionSave);
        return new ResponseObject(promotionSave);
    }

//    @Transactional(rollbackFor = NgoaiLe.class)
//    public ResponseObject update(Long id, KhuyenMaiRequest request) {
//        KhuyenMai promotion = khuyenMaiRepository.findById(id)
//                .orElseThrow(() -> new NgoaiLe("Đợt giảm giá không tồn tại"));
//
//        // Các kiểm tra cơ bản
//        if (request.getCode().length() > 20) {
//            throw new NgoaiLe("Mã đợt giảm giá không được vượt quá 20 kí tự.");
//        }
//        if (!promotion.getCode().equalsIgnoreCase(request.getCode()) && !isCodeUnique(request.getCode())) {
//            throw new NgoaiLe("Mã đợt giảm giá đã tồn tại");
//        }
//        if (request.getName().length() > 50) {
//            throw new NgoaiLe("Tên đợt giảm giá không được vượt quá 50 kí tự.");
//        }
//        if (request.getValue() < 1 || request.getValue() > 50) {
//            throw new NgoaiLe("Vui lòng nhập giá trị (%) hợp lệ!");
//        }
//        if (request.getStartDate().isAfter(request.getEndDate())) {
//            throw new NgoaiLe("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
//        }
//        if (request.getStartDate().isEqual(request.getEndDate())) {
//            throw new NgoaiLe("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
//        }
//
//        // Kiểm tra SPCT có đang trong promotion hoạt động khác không
//        for (Long shoeDetailId : request.getProductDetails()) {
//            KhuyenMaiChiTiet existingDetail = khuyenMaiChiTietRepository.findByShoeDetailId(shoeDetailId);
//            if (existingDetail != null && !existingDetail.getPromotion().getId().equals(id)) {
//                boolean isInActivePromotion = khuyenMaiChiTietRepository.existsByShoeDetailIdAndActivePromotion(shoeDetailId);
//                if (isInActivePromotion) {
//                    SanPhamChiTiet shoeDetail = sanPhamChiTietRepository.findById(shoeDetailId)
//                            .orElseThrow(() -> new NgoaiLe("Sản phẩm chi tiết không tồn tại"));
//                    throw new NgoaiLe("Sản phẩm '" + shoeDetail.getCode() + "' đang tham gia một đợt giảm giá khác còn hoạt động!");
//                }
//            }
//        }
//
//        // Xóa tất cả bản ghi cũ của promotion hiện tại
//        deleteAll(id);
//
//        // Cập nhật thông tin đợt giảm giá
//        KhuyenMai promotionSave = khuyenMaiConver.convertRequestToEntity(promotion, request);
//        promotionSave.setId(id);
//        promotionSave = khuyenMaiRepository.save(promotionSave);
//
//        // Tạo lại các chi tiết khuyến mãi mới
//        for (Long shoeDetailId : request.getProductDetails()) {
//            SanPhamChiTiet shoeDetail = sanPhamChiTietRepository.findById(shoeDetailId)
//                    .orElseThrow(() -> new NgoaiLe("Sản phẩm chi tiết không tồn tại"));
//            KhuyenMaiChiTiet promotionDetail = new KhuyenMaiChiTiet();
//            promotionDetail.setPromotion(promotionSave);
//            promotionDetail.setShoeDetail(shoeDetail);
//            promotionDetail.setPromotionPrice(shoeDetail.getPrice().subtract(
//                    (shoeDetail.getPrice().divide(new BigDecimal("100"))).multiply(new BigDecimal(request.getValue()))
//            ));
//            khuyenMaiChiTietRepository.save(promotionDetail);
//        }
//
//        // Cập nhật trạng thái promotion
//        updateStatusPromotion();
//        return new ResponseObject(promotionSave);
//    }



    public KhuyenMaiResponse getOne(Long id) {
        return khuyenMaiRepository.getOnePromotion(id);
    }

    public List<Long> getListIdShoePromotion(Long idPromotion) {
        return khuyenMaiChiTietRepository.getListIdShoePromotion(idPromotion).stream()
                .flatMap(ids -> Arrays.stream(ids.split(",")))
                .map(Long::valueOf)
                .collect(Collectors.toList());
    }

    public List<Long> getListIdShoeDetailInPromotion(Long idPromotion) {
        return khuyenMaiChiTietRepository.getListIdShoeDetailInPromotion(idPromotion).stream()
                .map(Long::valueOf)
                .collect(Collectors.toList());
    }

    public KhuyenMai updateEndDate(Long id) {
        KhuyenMai promotionToUpdate = khuyenMaiRepository.findById(id).orElse(null);
        LocalDateTime currentDate = LocalDateTime.now();
        if (promotionToUpdate.getStatus() == 2) {
            throw new NgoaiLe("Đợt giảm giá này đã kết thúc rồi!");
        }
        if (promotionToUpdate.getStatus() == 0) {
            LocalDateTime startDate = currentDate.with(LocalTime.MIN);
            promotionToUpdate.setStartDate(startDate);
        }
        promotionToUpdate.setEndDate(currentDate);
        promotionToUpdate.setStatus(2); // Đã kết thúc
        return khuyenMaiRepository.save(promotionToUpdate);
    }

    public void deleteAll(Long idPromotion) {
        khuyenMaiChiTietRepository.deleteAllById(khuyenMaiChiTietRepository.findIdsByPromotionId(idPromotion));
    }

    public void updateStatus(KhuyenMai promotion) {
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime startDate = promotion.getStartDate();
        LocalDateTime endDate = promotion.getEndDate();
        if (currentDate.isBefore(startDate)) {
            promotion.setStatus(0); // Chưa bắt đầu
        } else if (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) {
            promotion.setStatus(1); // Đang diễn ra
        } else {
            promotion.setStatus(2); // Đã kết thúc
        }
        khuyenMaiRepository.save(promotion);
    }



    // Trong KhuyenMaiServiceImpl
    public List<Long> getAllActiveShoeDetailIds() {
        return khuyenMaiChiTietRepository.findAllActiveShoeDetailIds();
    }
}