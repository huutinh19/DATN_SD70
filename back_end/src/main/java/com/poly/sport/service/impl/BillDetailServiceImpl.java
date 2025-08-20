


package com.poly.sport.service.impl;

import com.poly.sport.entity.*;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.constant.BillStatusConstant;
import com.poly.sport.infrastructure.constant.PaymentMethodConstant;
import com.poly.sport.infrastructure.converter.BillDetailConvert;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.BillDetailRequest;
import com.poly.sport.infrastructure.response.BillDetailResponse;
import com.poly.sport.repository.*;
import com.poly.sport.service.BillDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillDetailServiceImpl implements BillDetailService {

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
    @Autowired
    private IPaymentMethodRepository paymentMethodRepository;

    public PhanTrang<BillDetailResponse> getAll(BillDetailRequest request) {
        return new PhanTrang<>(billDetailRepository.getAllBillDetail(request, PageRequest.of(request.getPage() - 1, request.getSizePage())));
    }

    public BillDetail getOne(Long id) {
        return billDetailRepository.findById(id).orElse(null);
    }

    private void updateBillTotals(Bill bill) {
        Double calculateTotalMoney = 0.0;
        for (BillDetail x : billDetailRepository.findByBillId(bill.getId())) {
            calculateTotalMoney += x.getQuantity() * x.getPrice().doubleValue();
        }
        bill.setTotalMoney(BigDecimal.valueOf(calculateTotalMoney));

        // Calculate moneyReduce if there is a voucher
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

        BigDecimal totalMoney = bill.getTotalMoney() != null ? bill.getTotalMoney() : BigDecimal.ZERO;
        BigDecimal moneyReduce = bill.getMoneyReduce() != null ? bill.getMoneyReduce() : BigDecimal.ZERO;
        bill.setTotalMoney(totalMoney.subtract(moneyReduce));
        billRepository.save(bill);
    }

    @Override
    @Transactional(rollbackFor = NgoaiLe.class)
    public BillDetail create(BillDetailRequest request) {
        // Retrieve product details and promotion
        SanPhamChiTiet shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
        if (shoeDetail == null) {
            throw new NgoaiLe("Không tìm thấy sản phẩm chi tiết với mã: " + request.getShoeDetail());
        }

        KhuyenMaiChiTiet khuyenMaiChiTiet = khuyenMaiChiTietRepository.findByShoeDetailCode(request.getShoeDetail());
        Bill bill = billRepository.findById(request.getBill())
                .orElseThrow(() -> new NgoaiLe("Không tìm thấy hóa đơn với ID: " + request.getBill()));

        // Validate quantity
        if (request.getQuantity() < 1) {
            throw new NgoaiLe("Số lượng phải lớn hơn 0!");
        }

        // Check if the product is discontinued
        SanPham sanPham = shoeDetail.getShoe();
        if (sanPham.getDeleted()) {
            throw new NgoaiLe("Sản phẩm " + sanPham.getName() + " đã dừng bán, không thể thêm vào hóa đơn!");
        }

        // Determine price and promotion at the time of adding the product
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

        // Check inventory based on bill status
        int availableStock = shoeDetail.getQuantity();
        int totalQuantityInBill = billDetailRepository.findByBillId(bill.getId()).stream()
                .filter(detail -> detail.getShoeDetail().getCode().equals(request.getShoeDetail()))
                .mapToInt(BillDetail::getQuantity)
                .sum();
        int newTotalQuantity = totalQuantityInBill + request.getQuantity();

        if (bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN) {
            // Only validate stock
            if (newTotalQuantity > availableStock) {
                throw new NgoaiLe("Quá số lượng cho phép! Chỉ còn " + availableStock + " sản phẩm trong kho.");
            }
        } else if (bill.getStatus() == BillStatusConstant.DA_XAC_NHAN ||
                bill.getStatus() == BillStatusConstant.CHO_GIAO_HANG) {
            // Validate stock
            if (newTotalQuantity > availableStock) {
                throw new NgoaiLe("Quá số lượng cho phép! Chỉ còn " + availableStock + " sản phẩm trong kho.");
            }
            // Defer inventory deduction until after checking existing BillDetail
        }

        // Check for existing BillDetail with same bill, shoeDetail, price, and discountPercent
        BillDetail existingBillDetail = billDetailRepository.findByBillAndShoeDetailAndDiscountPercentAndPrice(
                bill, shoeDetail, discountPercent, price);

        BillDetail billDetail;
        if (existingBillDetail != null) {
            // If exists, accumulate quantity
            int updatedQuantity = existingBillDetail.getQuantity() + request.getQuantity();
            if (bill.getStatus() == BillStatusConstant.DA_XAC_NHAN ||
                    bill.getStatus() == BillStatusConstant.CHO_GIAO_HANG) {
                // Validate stock for updated quantity
                if (totalQuantityInBill + updatedQuantity > availableStock) {
                    throw new NgoaiLe("Quá số lượng cho phép! Chỉ còn " + availableStock + " sản phẩm trong kho.");
                }
                // Deduct inventory for the additional quantity
                shoeDetail.setQuantity(shoeDetail.getQuantity() - request.getQuantity());
                shoeDetailRepository.save(shoeDetail);
            }
            existingBillDetail.setQuantity(updatedQuantity);
            billDetail = existingBillDetail;
        } else {
            // Create new BillDetail
            billDetail = billDetailConvert.convertRequestToEntity(request);
            billDetail.setPrice(price);
            billDetail.setDiscountPercent(discountPercent);
            billDetail.setDiscountValue(discountValue);
            billDetail.setBill(bill);
            billDetail.setShoeDetail(shoeDetail);
            billDetail.setQuantity(request.getQuantity());
            billDetail.setStatus(true);
            if (bill.getStatus() == BillStatusConstant.DA_XAC_NHAN ||
                    bill.getStatus() == BillStatusConstant.CHO_GIAO_HANG) {
                // Deduct inventory for the new quantity
                shoeDetail.setQuantity(shoeDetail.getQuantity() - request.getQuantity());
                shoeDetailRepository.save(shoeDetail);
            }
        }

        // Save BillDetail
        billDetailRepository.save(billDetail);

        // Update bill totals
        updateBillTotals(bill);

        // Log history for editable statuses
        if (bill.getStatus() == BillStatusConstant.CHO_GIAO_HANG ||
                bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN ||
                bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN ||
                bill.getStatus() == BillStatusConstant.DA_XAC_NHAN) {
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(bill);
            billHistory.setNote("Đã thêm sản phẩm \"" + shoeDetail.getShoe().getName() +
                    " [" + shoeDetail.getColor().getName() + "-" + shoeDetail.getSize().getName() +
                    "]\" với số lượng \"" + request.getQuantity() + "\"");
            billHistory.setStatus(BillStatusConstant.CHINH_SUA_DON_HANG);
            billHistoryRepository.save(billHistory);
        }

        return billDetail;
    }

    @Override
    @Transactional(rollbackFor = NgoaiLe.class)
    public BillDetail delete(Long id) {
        BillDetail billDetail = billDetailRepository.findById(id)
                .orElseThrow(() -> new NgoaiLe("Chi tiết hóa đơn không tồn tại!"));
        Bill bill = billDetail.getBill();
        SanPhamChiTiet shoeDetail = billDetail.getShoeDetail();
        Integer quantity = billDetail.getQuantity();

        // Restore inventory for DA_XAC_NHAN or CHO_GIAO_HANG
        if (bill.getStatus() == BillStatusConstant.DA_XAC_NHAN ||
                bill.getStatus() == BillStatusConstant.CHO_GIAO_HANG) {
            shoeDetail.setQuantity(shoeDetail.getQuantity() + quantity);
            shoeDetailRepository.save(shoeDetail);
        }

        // Delete BillDetail
        billDetailRepository.delete(billDetail);

        // Update bill totals
        updateBillTotals(bill);

        // Log history for editable statuses
        if (bill.getStatus() == BillStatusConstant.CHO_GIAO_HANG ||
                bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN ||
                bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN ||
                bill.getStatus() == BillStatusConstant.DA_XAC_NHAN) {
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(bill);
            billHistory.setNote("Đã xóa giày \"" + shoeDetail.getShoe().getName() +
                    " [" + shoeDetail.getColor().getName() + "-" + shoeDetail.getSize().getName() +
                    "]\" với số lượng \"" + quantity + "\"");
            billHistory.setStatus(BillStatusConstant.CHINH_SUA_DON_HANG);
            billHistoryRepository.save(billHistory);
        }

        return billDetail;
    }

    @Override
    @Transactional(rollbackFor = NgoaiLe.class)
    public BillDetail updateQuantity(Long id, Integer newQuantity, BigDecimal price) {
        BillDetail billDetail = billDetailRepository.findById(id)
                .orElseThrow(() -> new NgoaiLe("Chi tiết hóa đơn không tồn tại!"));
        SanPhamChiTiet shoeDetail = billDetail.getShoeDetail();
        Bill bill = billDetail.getBill();
        SanPham sanPham = shoeDetail.getShoe();

        // Check if product is discontinued
        if (sanPham.getDeleted()) {
            throw new NgoaiLe("Sản phẩm " + sanPham.getName() + " đã dừng bán, không thể thay đổi số lượng!");
        }

        // Get the latest price and promotion
        KhuyenMaiChiTiet khuyenMaiChiTiet = khuyenMaiChiTietRepository.findByShoeDetailCode(shoeDetail.getCode());
        BigDecimal latestPrice;
        Float latestDiscountPercent = null;
        LocalDateTime now = LocalDateTime.now();
        if (khuyenMaiChiTiet != null && khuyenMaiChiTiet.getPromotion() != null) {
            KhuyenMai km = khuyenMaiChiTiet.getPromotion();
            if (now.isAfter(km.getStartDate()) && now.isBefore(km.getEndDate())) {
                latestPrice = khuyenMaiChiTiet.getPromotionPrice();
                latestDiscountPercent = km.getValue();
            } else {
                latestPrice = shoeDetail.getPrice();
            }
        } else {
            latestPrice = shoeDetail.getPrice();
        }

        // Check if the BillDetail has an outdated price
        if (billDetail.getPrice().compareTo(latestPrice) != 0) {
            throw new NgoaiLe("Không thể cập nhật số lượng vì sản phẩm này có giá cũ (" + billDetail.getPrice() +
                    " VNĐ). Vui lòng thêm sản phẩm với giá mới (" + latestPrice + " VNĐ)!");
        }

        // Check if the promotion has changed
        Float currentDiscountPercent = billDetail.getDiscountPercent();
        if (latestDiscountPercent != null &&
                (currentDiscountPercent == null || !latestDiscountPercent.equals(currentDiscountPercent))) {
            throw new NgoaiLe("Không thể cập nhật số lượng vì sản phẩm này có chương trình khuyến mãi mới hơn (" +
                    latestDiscountPercent + "%). Vui lòng thêm sản phẩm với khuyến mãi mới!");
        }

        // Save original state
        Integer originalQuantity = billDetail.getQuantity();

        // Validate new quantity
        if (newQuantity <= 0) {
            throw new NgoaiLe("Vui lòng nhập số lượng hợp lệ!");
        }

        // Check inventory and update stock based on bill status
        int availableStock = shoeDetail.getQuantity();
        int totalQuantityInBill = billDetailRepository.findByBillId(bill.getId()).stream()
                .filter(detail -> detail.getShoeDetail().getCode().equals(shoeDetail.getCode()) && !detail.getId().equals(id))
                .mapToInt(BillDetail::getQuantity)
                .sum();
        int newTotalQuantity = totalQuantityInBill + newQuantity;

        if (bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN) {
            // Only validate stock without updating inventory
            if (newTotalQuantity > availableStock) {
                throw new NgoaiLe("Quá số lượng cho phép! Chỉ còn " + availableStock + " sản phẩm trong kho.");
            }
        } else if (bill.getStatus() == BillStatusConstant.DA_XAC_NHAN ||
                bill.getStatus() == BillStatusConstant.CHO_GIAO_HANG) {
            // Validate and update inventory
            if (newTotalQuantity > availableStock + originalQuantity) {
                throw new NgoaiLe("Quá số lượng cho phép! Chỉ còn " + (availableStock + originalQuantity) + " sản phẩm trong kho.");
            }
            // Update inventory: restore original quantity, then deduct new quantity
            shoeDetail.setQuantity(shoeDetail.getQuantity() + originalQuantity);
            shoeDetail.setQuantity(shoeDetail.getQuantity() - newQuantity);
            shoeDetailRepository.save(shoeDetail);
        }

        // Calculate total paid amount
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findByBillIdAndType(bill.getId(), PaymentMethodConstant.TIEN_KHACH_DUA);
        BigDecimal totalPaid = BigDecimal.ZERO;
        for (PaymentMethod pm : paymentMethods) {
            totalPaid = totalPaid.add(pm.getTotalMoney() != null ? pm.getTotalMoney() : BigDecimal.ZERO);
        }

        // Handle logic based on bill status for payment validation
        if (bill.getStatus() >= BillStatusConstant.XAC_NHAN_THONG_TIN_THANH_TOAN) {
            BigDecimal newTotal = billDetail.getPrice().multiply(BigDecimal.valueOf(newQuantity));
            BigDecimal currentTotal = billDetail.getPrice().multiply(BigDecimal.valueOf(billDetail.getQuantity()));
            BigDecimal billTotalWithoutCurrentDetail = bill.getTotalMoney().subtract(currentTotal);
            BigDecimal newBillTotal = billTotalWithoutCurrentDetail.add(newTotal);

            if (newBillTotal.compareTo(totalPaid) < 0) {
                throw new NgoaiLe("Không thể giảm số tiền dưới số tiền đã thanh toán (" + totalPaid + " VNĐ)!");
            }
        }

        // Update quantity
        billDetail.setQuantity(newQuantity);

        // Save changes
        billDetailRepository.save(billDetail);

        // Update bill totals
        updateBillTotals(bill);

        // Log history for editable statuses
        if (bill.getStatus() == BillStatusConstant.CHO_GIAO_HANG ||
                bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN ||
                bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN ||
                bill.getStatus() == BillStatusConstant.DA_XAC_NHAN) {
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(bill);
            billHistory.setNote("Đã sửa số lượng giày \"" + shoeDetail.getShoe().getName() +
                    " [" + shoeDetail.getColor().getName() + "-" + shoeDetail.getSize().getName() +
                    "]\" từ \"" + originalQuantity + "\" lên \"" + newQuantity + "\"");
            billHistory.setStatus(BillStatusConstant.CHINH_SUA_DON_HANG);
            billHistoryRepository.save(billHistory);
        }

        return billDetail;
    }

    public Bill changeStatus(Long id, String note) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new NgoaiLe("Hóa đơn không tồn tại!"));
        BillHistory history = new BillHistory();
        history.setBill(bill);
        history.setNote(note);

        if (bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN) {
            if (bill.getType() == 0) {
                bill.setStatus(BillStatusConstant.HOAN_THANH);
                history.setStatus(BillStatusConstant.HOAN_THANH);
            } else {
                bill.setStatus(BillStatusConstant.HOAN_THANH);
                history.setStatus(BillStatusConstant.HOAN_THANH);
            }
        } else if (bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN) {
            // Deduct inventory when moving to DA_XAC_NHAN
            List<BillDetail> billDetails = billDetailRepository.findByBillId(bill.getId());
            for (BillDetail detail : billDetails) {
                SanPhamChiTiet shoeDetail = detail.getShoeDetail();
                int availableStock = shoeDetail.getQuantity();
                if (detail.getQuantity() > availableStock) {
                    throw new NgoaiLe("Không thể xác nhận đơn hàng! Sản phẩm " + shoeDetail.getShoe().getName() +
                            " chỉ còn " + availableStock + " trong kho.");
                }
                shoeDetail.setQuantity(availableStock - detail.getQuantity());
                shoeDetailRepository.save(shoeDetail);
            }
            bill.setStatus(BillStatusConstant.DA_XAC_NHAN);
            history.setStatus(BillStatusConstant.DA_XAC_NHAN);
        } else if (bill.getStatus() == BillStatusConstant.DA_XAC_NHAN) {
            bill.setStatus(BillStatusConstant.CHO_GIAO_HANG);
            history.setStatus(BillStatusConstant.CHO_GIAO_HANG);
        } else {
            bill.setStatus(bill.getStatus() + 1);
            history.setStatus(bill.getStatus());
        }

        Bill billSave = billRepository.save(bill);
        if (billSave != null) {
            billHistoryRepository.save(history);
        }

        return billSave;
    }

    public Float getLatestDiscountPercent(String shoeDetailCode, Long billId) {
        KhuyenMaiChiTiet khuyenMaiChiTiet = khuyenMaiChiTietRepository.findByShoeDetailCode(shoeDetailCode);
        LocalDateTime now = LocalDateTime.now();
        if (khuyenMaiChiTiet != null && khuyenMaiChiTiet.getPromotion() != null) {
            KhuyenMai km = khuyenMaiChiTiet.getPromotion();
            if (now.isAfter(km.getStartDate()) && now.isBefore(km.getEndDate())) {
                return km.getValue();
            }
        }
        return null;
    }
}