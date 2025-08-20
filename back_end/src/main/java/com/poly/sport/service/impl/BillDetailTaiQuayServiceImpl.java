package com.poly.sport.service.impl;

import com.poly.sport.entity.*;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.constant.BillStatusConstant;
import com.poly.sport.infrastructure.converter.BillDetailConvert;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.BillDetailRequest;
import com.poly.sport.infrastructure.response.BillDetailResponse;
import com.poly.sport.repository.*;
import com.poly.sport.service.BillDetailTaiQuayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class BillDetailTaiQuayServiceImpl implements BillDetailTaiQuayService {

    @Autowired
    private IBillDetailRepository billDetailRepository;
    @Autowired
    private BillDetailConvert billDetailConvert;
    @Autowired
    private SanPhamChiTietRepository shoeDetailRepository;
    @Autowired
    private IBillRepository billRepository;
    @Autowired
    private IBillHistoryRepository billHistoryRepository;
    @Autowired
    private KhuyenMaiChiTietRepository khuyenMaiChiTietRepository;

    public PhanTrang<BillDetailResponse> getAll(BillDetailRequest request) {
        return new PhanTrang<>(billDetailRepository.getAllBillDetailTaiQuay(request, PageRequest.of(request.getPage() - 1, request.getSizePage())));
    }

    public BillDetail getOne(Long id) {
        return billDetailRepository.findById(id).orElse(null);
    }

    private void updateBillTotals(Bill bill) {
        Double caculateTotalMoney = 0.0;
        for (BillDetail x : billDetailRepository.findByBillId(bill.getId())) {
            caculateTotalMoney += x.getQuantity() * x.getPrice().doubleValue();
        }
        bill.setTotalMoney(BigDecimal.valueOf(caculateTotalMoney));

        // Tính lại moneyReduce nếu có voucher
        if (bill.getVoucher() != null) {
            Voucher voucher = bill.getVoucher();
            BigDecimal totalMoney = bill.getTotalMoney() != null ? bill.getTotalMoney() : BigDecimal.ZERO;
            BigDecimal minBillValue = voucher.getMinBillValue() != null ? voucher.getMinBillValue() : BigDecimal.ZERO;
            if (totalMoney.compareTo(minBillValue) >= 0) {
                BigDecimal calculatedDiscount = totalMoney.multiply(BigDecimal.valueOf(voucher.getPercentReduce()).divide(BigDecimal.valueOf(100)));
                BigDecimal finalDiscount = calculatedDiscount;
                if (voucher.getMaxBillValue() != null && calculatedDiscount.compareTo(voucher.getMaxBillValue()) > 0) {
                    finalDiscount = voucher.getMaxBillValue();
                }
                bill.setMoneyReduce(finalDiscount);
            } else {
                bill.setMoneyReduce(BigDecimal.ZERO);
            }
        } else {
            bill.setMoneyReduce(BigDecimal.ZERO);
        }

        // Kiểm tra null trước khi thực hiện phép trừ
        BigDecimal totalMoney = bill.getTotalMoney() != null ? bill.getTotalMoney() : BigDecimal.ZERO;
        BigDecimal moneyReduce = bill.getMoneyReduce() != null ? bill.getMoneyReduce() : BigDecimal.ZERO;
        bill.setTotalMoney(totalMoney.subtract(moneyReduce));
        billRepository.save(bill);
    }

//    public BillDetail create(BillDetailRequest request) {
//        KhuyenMaiChiTiet khuyenMaiChiTiet = khuyenMaiChiTietRepository.findByShoeDetailCode(request.getShoeDetail());
//        BillDetail billDetail = billDetailConvert.convertRequestToEntity(request);
//        SanPhamChiTiet shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
//        if (request.getQuantity() < 1) {
//            throw new NgoaiLe("Số lượng phải lớn hơn 1!");
//        } else if (request.getQuantity() > shoeDetail.getQuantity()) {
//            throw new NgoaiLe("Quá số lượng cho phép!");
//        }
//        shoeDetail.setQuantity(shoeDetail.getQuantity() - request.getQuantity());
//        shoeDetailRepository.save(shoeDetail);
//
//        BillDetail existBillDetail = billDetailRepository.findByShoeDetailCodeAndBillId(request.getShoeDetail(), request.getBill());
//        Bill bill = billRepository.findById(request.getBill()).get();
//
//        if (existBillDetail != null) {
//            existBillDetail.setPrice(khuyenMaiChiTiet != null ? khuyenMaiChiTiet.getPromotionPrice() : shoeDetail.getPrice());
//            existBillDetail.setQuantity(existBillDetail.getQuantity() + request.getQuantity());
//            if (existBillDetail.getPrice().compareTo(request.getPrice()) < 0) {
//                existBillDetail.setPrice(request.getPrice());
//            }
//            billDetailRepository.save(existBillDetail);
//        } else {
//            billDetailRepository.save(billDetail);
//        }
//
//        updateBillTotals(bill);
//        return existBillDetail != null ? existBillDetail : billDetail;
//    }


//    @Override
//    public BillDetail create(BillDetailRequest request) {
//        SanPhamChiTiet shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
//        if (shoeDetail == null) {
//            throw new NgoaiLe("Không tìm thấy sản phẩm chi tiết với mã: " + request.getShoeDetail());
//        }
//
//        KhuyenMaiChiTiet khuyenMaiChiTiet = khuyenMaiChiTietRepository.findByShoeDetailCode(request.getShoeDetail());
//        Bill bill = billRepository.findById(request.getBill())
//                .orElseThrow(() -> new NgoaiLe("Không tìm thấy hóa đơn với ID: " + request.getBill()));
//
//        if (request.getQuantity() < 1) {
//            throw new NgoaiLe("Số lượng phải lớn hơn 0!");
//        } else if (request.getQuantity() > shoeDetail.getQuantity()) {
//            throw new NgoaiLe("Số lượng yêu cầu vượt quá số lượng tồn kho!");
//        }
//
//        BigDecimal price;
//        Float discountPercent = null;
//        BigDecimal discountValue = null;
//        LocalDateTime now = LocalDateTime.now();
//        if (khuyenMaiChiTiet != null && khuyenMaiChiTiet.getPromotion() != null) {
//            KhuyenMai km = khuyenMaiChiTiet.getPromotion();
//            if (now.isAfter(km.getStartDate()) && now.isBefore(km.getEndDate())) {
//                price = khuyenMaiChiTiet.getPromotionPrice();
//                discountPercent = km.getValue();
//                discountValue = khuyenMaiChiTiet.getPromotionPrice();
//            } else {
//                price = shoeDetail.getPrice();
//            }
//        } else {
//            price = shoeDetail.getPrice();
//        }
//
//        BillDetail existingBillDetail = billDetailRepository.findByBillAndShoeDetailAndDiscountPercent(
//                bill, shoeDetail, discountPercent);
//
//        BillDetail billDetail;
//        if (existingBillDetail != null) {
//            existingBillDetail.setQuantity(existingBillDetail.getQuantity() + request.getQuantity());
//            billDetail = existingBillDetail;
//        } else {
//            billDetail = billDetailConvert.convertRequestToEntity(request);
//            billDetail.setPrice(price);
//            billDetail.setDiscountPercent(discountPercent);
//            billDetail.setDiscountValue(discountValue);
//            billDetail.setBill(bill);
//            billDetail.setShoeDetail(shoeDetail);
//            billDetail.setQuantity(request.getQuantity());
//            billDetail.setStatus(true);
//        }
//
//        shoeDetail.setQuantity(shoeDetail.getQuantity() - request.getQuantity());
//        shoeDetailRepository.save(shoeDetail);
//
//        billDetailRepository.save(billDetail);
//
//        updateBillTotals(bill);
//
//        return billDetail;
//    }


    @Override
    public BillDetail create(BillDetailRequest request) {
        SanPhamChiTiet shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
        if (shoeDetail == null) {
            throw new NgoaiLe("Không tìm thấy sản phẩm chi tiết với mã: " + request.getShoeDetail());
        }

        // Kiểm tra trạng thái của SanPham
        SanPham sanPham = shoeDetail.getShoe(); // Giả sử SanPhamChiTiet có liên kết tới SanPham
        if (sanPham.getDeleted()) { // deleted = true nghĩa là sản phẩm đã dừng bán
            throw new NgoaiLe("Sản phẩm " + sanPham.getName() + " đã dừng bán, không thể thêm vào hóa đơn!");
        }

        KhuyenMaiChiTiet khuyenMaiChiTiet = khuyenMaiChiTietRepository.findByShoeDetailCode(request.getShoeDetail());
        Bill bill = billRepository.findById(request.getBill())
                .orElseThrow(() -> new NgoaiLe("Không tìm thấy hóa đơn với ID: " + request.getBill()));

        if (request.getQuantity() < 1) {
            throw new NgoaiLe("Số lượng phải lớn hơn 0!");
        } else if (request.getQuantity() > shoeDetail.getQuantity()) {
            throw new NgoaiLe("Số lượng yêu cầu vượt quá số lượng tồn kho!");
        }

        BigDecimal price;
        Float discountPercent = null;
        BigDecimal discountValue = null;
        LocalDateTime now = LocalDateTime.now();
        if (khuyenMaiChiTiet != null && khuyenMaiChiTiet.getPromotion() != null) {
            KhuyenMai km = khuyenMaiChiTiet.getPromotion();
            if (now.isAfter(km.getStartDate()) && now.isBefore(km.getEndDate())) {
                price = khuyenMaiChiTiet.getPromotionPrice();
                discountPercent = km.getValue();
                discountValue = khuyenMaiChiTiet.getPromotionPrice();
            } else {
                price = shoeDetail.getPrice();
            }
        } else {
            price = shoeDetail.getPrice();
        }

        BillDetail existingBillDetail = billDetailRepository.findByBillAndShoeDetailAndDiscountPercent(
                bill, shoeDetail, discountPercent);

        BillDetail billDetail;
        if (existingBillDetail != null) {
            existingBillDetail.setQuantity(existingBillDetail.getQuantity() + request.getQuantity());
            billDetail = existingBillDetail;
        } else {
            billDetail = billDetailConvert.convertRequestToEntity(request);
            billDetail.setPrice(price);
            billDetail.setDiscountPercent(discountPercent);
            billDetail.setDiscountValue(discountValue);
            billDetail.setBill(bill);
            billDetail.setShoeDetail(shoeDetail);
            billDetail.setQuantity(request.getQuantity());
            billDetail.setStatus(true);
        }

        shoeDetail.setQuantity(shoeDetail.getQuantity() - request.getQuantity());
        shoeDetailRepository.save(shoeDetail);

        billDetailRepository.save(billDetail);

        updateBillTotals(bill);

        return billDetail;
    }

    public BillDetail update(Long id, BillDetailRequest request) {
        BillDetail old = billDetailRepository.findById(id).get();
        BillDetail updatedBillDetail = billDetailConvert.convertRequestToEntity(old, request);
        billDetailRepository.save(updatedBillDetail);
        updateBillTotals(old.getBill());
        return updatedBillDetail;
    }

//    public BillDetail delete(Long id) {
//        BillDetail billDetail = billDetailRepository.findById(id).get();
//        SanPhamChiTiet shoeDetail = billDetail.getShoeDetail();
//        Bill bill = billDetail.getBill();
//
//        shoeDetail.setQuantity(shoeDetail.getQuantity() + billDetail.getQuantity());
//        billDetailRepository.delete(billDetail);
//        shoeDetailRepository.save(shoeDetail);
//
//        updateBillTotals(bill);
//        return billDetail;
//    }

    public BillDetail delete(Long id) {
        BillDetail billDetail = billDetailRepository.findById(id)
                .orElseThrow(() -> new NgoaiLe("Chi tiết hóa đơn không tồn tại!"));
        SanPhamChiTiet shoeDetail = billDetail.getShoeDetail();
        Bill bill = billDetail.getBill();

        // Cập nhật số lượng sản phẩm trước khi xóa
        Integer originalShoeQuantity = shoeDetail.getQuantity();
        shoeDetail.setQuantity(shoeDetail.getQuantity() + billDetail.getQuantity());
        shoeDetailRepository.save(shoeDetail);

        // Cập nhật tổng tiền hóa đơn trước khi xóa
        updateBillTotals(bill);

        // Kiểm tra điều kiện minBillValue nếu có voucher
//        if (bill.getVoucher() != null) {
//            BigDecimal totalMoney = bill.getTotalMoney() != null ? bill.getTotalMoney() : BigDecimal.ZERO;
//            BigDecimal minBillValue = bill.getVoucher().getMinBillValue();
//            if (totalMoney.compareTo(minBillValue) < 0) {
//                // Hoàn tác thay đổi nếu không đủ điều kiện
//                shoeDetail.setQuantity(originalShoeQuantity);
//                shoeDetailRepository.save(shoeDetail);
//                updateBillTotals(bill); // Cập nhật lại tổng tiền
//                throw new NgoaiLe("Tổng tiền sau khi xóa (" + totalMoney + ") nhỏ hơn giá trị tối thiểu của voucher (" + minBillValue + ")!");
//            }
//        }

        // Chỉ xóa sau khi kiểm tra thành công
        billDetailRepository.delete(billDetail);

        // Ghi lịch sử nếu hóa đơn đang ở trạng thái cho phép chỉnh sửa
//        if (bill.getStatus() == BillStatusConstant.CHO_GIAO ||
//                bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN ||
//                bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN) {
//            BillHistory billHistory = new BillHistory();
//            billHistory.setBill(bill);
//            billHistory.setNote("Đã xóa sản phẩm \"" + shoeDetail.getShoe().getName() +
//                    " [" + shoeDetail.getColor().getName() + "-" + shoeDetail.getSize().getName() + "]\"");
//            billHistory.setStatus(BillStatusConstant.CHINH_SUA_DON_HANG);
//            billHistoryRepository.save(billHistory);
//        }

        return billDetail;
    }

//    @Override
//    public BillDetail updateQuantity(Long id, Integer newQuantity, BigDecimal price) {
//        BillDetail billDetail = billDetailRepository.findById(id).get();
//        SanPhamChiTiet shoeDetail = billDetail.getShoeDetail();
//        Bill bill = billDetail.getBill();
//
//        if (newQuantity > (shoeDetail.getQuantity() + billDetail.getQuantity())) {
//            throw new NgoaiLe("Quá số lượng cho phép!");
//        }
//        if (newQuantity <= 0) {
//            throw new NgoaiLe("Vui lòng nhập số lượng hợp lệ!");
//        }
//
//        shoeDetail.setQuantity(shoeDetail.getQuantity() + billDetail.getQuantity() - newQuantity);
//        billDetail.setQuantity(newQuantity);
//        if (price != null && billDetail.getPrice().compareTo(price) < 0) {
//            billDetail.setPrice(price);
//        }
//        billDetailRepository.save(billDetail);
//        shoeDetailRepository.save(shoeDetail);
//
//        updateBillTotals(bill);
//
//        if (bill.getStatus() == BillStatusConstant.CHO_GIAO || bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN || bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN) {
//            BillHistory billHistory = new BillHistory();
//            billHistory.setBill(bill);
//            billHistory.setNote("Đã sửa số lượng " + " giày \"" + shoeDetail.getShoe().getName() + " [" + shoeDetail.getColor().getName() + "-" + shoeDetail.getSize().getName() + "]\" lên \"" + newQuantity + "\"");
//            billHistory.setStatus(BillStatusConstant.CHINH_SUA_DON_HANG);
//            billHistoryRepository.save(billHistory);
//        }
//
//        return billDetail;
//    }

//    @Override
//    public BillDetail updateQuantity(Long id, Integer newQuantity, BigDecimal price) {
//        BillDetail billDetail = billDetailRepository.findById(id)
//                .orElseThrow(() -> new NgoaiLe("Chi tiết hóa đơn không tồn tại!"));
//        SanPhamChiTiet shoeDetail = billDetail.getShoeDetail();
//        Bill bill = billDetail.getBill();
//
//        // Lưu trạng thái ban đầu để hoàn tác nếu cần
//        Integer originalQuantity = billDetail.getQuantity();
//        Integer originalShoeQuantity = shoeDetail.getQuantity();
//
//        // Kiểm tra số lượng hợp lệ
//        if (newQuantity > (shoeDetail.getQuantity() + billDetail.getQuantity())) {
//            throw new NgoaiLe("Quá số lượng cho phép!");
//        }
//        if (newQuantity <= 0) {
//            throw new NgoaiLe("Vui lòng nhập số lượng hợp lệ!");
//        }
//
//        // Cập nhật số lượng tạm thời
//        shoeDetail.setQuantity(shoeDetail.getQuantity() + billDetail.getQuantity() - newQuantity);
//        billDetail.setQuantity(newQuantity);
//        if (price != null && billDetail.getPrice().compareTo(price) < 0) {
//            billDetail.setPrice(price);
//        }
//
//        // Lưu thay đổi tạm thời
//        billDetailRepository.save(billDetail);
//        shoeDetailRepository.save(shoeDetail);
//
//        // Cập nhật tổng tiền của hóa đơn
//        updateBillTotals(bill);
//
//        // Kiểm tra điều kiện minBillValue nếu có voucher
////        if (bill.getVoucher() != null) {
////            BigDecimal totalMoney = bill.getTotalMoney() != null ? bill.getTotalMoney() : BigDecimal.ZERO;
////            BigDecimal minBillValue = bill.getVoucher().getMinBillValue();
////            if (totalMoney.compareTo(minBillValue) < 0) {
////                // Hoàn tác thay đổi nếu không đủ điều kiện
////                shoeDetail.setQuantity(originalShoeQuantity);
////                billDetail.setQuantity(originalQuantity);
////                billDetailRepository.save(billDetail);
////                shoeDetailRepository.save(shoeDetail);
////                updateBillTotals(bill); // Cập nhật lại tổng tiền
////                throw new NgoaiLe("Tổng tiền sau khi sửa (" + totalMoney + ") nhỏ hơn giá trị tối thiểu của voucher (" + minBillValue + ")!");
////            }
////        }
//
//        // Ghi lịch sử nếu hóa đơn đang ở trạng thái cho phép chỉnh sửa
////        if (bill.getStatus() == BillStatusConstant.CHO_GIAO ||
////                bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN ||
////                bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN) {
////            BillHistory billHistory = new BillHistory();
////            billHistory.setBill(bill);
////            billHistory.setNote("Đã sửa số lượng giày \"" + shoeDetail.getShoe().getName() +
////                    " [" + shoeDetail.getColor().getName() + "-" + shoeDetail.getSize().getName() +
////                    "]\" lên \"" + newQuantity + "\"");
////            billHistory.setStatus(BillStatusConstant.CHINH_SUA_DON_HANG);
////            billHistoryRepository.save(billHistory);
////        }
//
//        return billDetail;
//    }
@Override
public BillDetail updateQuantity(Long id, Integer newQuantity, BigDecimal price) {
    BillDetail billDetail = billDetailRepository.findById(id)
            .orElseThrow(() -> new NgoaiLe("Chi tiết hóa đơn không tồn tại!"));
    SanPhamChiTiet shoeDetail = billDetail.getShoeDetail();
    Bill bill = billDetail.getBill();

    // Kiểm tra trạng thái của SanPham
    SanPham sanPham = shoeDetail.getShoe(); // Giả sử SanPhamChiTiet có liên kết tới SanPham
    if (sanPham.getDeleted()) { // deleted = true nghĩa là sản phẩm đã dừng bán
        throw new NgoaiLe("Sản phẩm " + sanPham.getName() + " đã dừng bán, không thể thay đổi số lượng!");
    }

    // Lưu trạng thái ban đầu để hoàn tác nếu cần
    Integer originalQuantity = billDetail.getQuantity();
    Integer originalShoeQuantity = shoeDetail.getQuantity();

    // Kiểm tra số lượng hợp lệ
    if (newQuantity > (shoeDetail.getQuantity() + billDetail.getQuantity())) {
        throw new NgoaiLe("Quá số lượng cho phép!");
    }
    if (newQuantity <= 0) {
        throw new NgoaiLe("Vui lòng nhập số lượng hợp lệ!");
    }

    // Cập nhật số lượng tạm thời
    shoeDetail.setQuantity(shoeDetail.getQuantity() + billDetail.getQuantity() - newQuantity);
    billDetail.setQuantity(newQuantity);
    if (price != null && billDetail.getPrice().compareTo(price) < 0) {
        billDetail.setPrice(price);
    }

    // Lưu thay đổi tạm thời
    billDetailRepository.save(billDetail);
    shoeDetailRepository.save(shoeDetail);

    // Cập nhật tổng tiền của hóa đơn
    updateBillTotals(bill);

    return billDetail;
}
    public Bill changeStatus(Long id, String note) {
        Bill bill = billRepository.findById(id).get();
        BillHistory history = new BillHistory();
        history.setBill(bill);
        history.setNote(note);
        history.setStatus(bill.getStatus() + 1);

        if (bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN) {
            if (bill.getType() == 0) {
                bill.setStatus(BillStatusConstant.HOAN_THANH);
            }
        } else {
            bill.setStatus(bill.getStatus() + 1);
        }

        Bill billSave = billRepository.save(bill);
        if (billSave != null) {
            billHistoryRepository.save(history);
        }
        return billSave;
    }
}
