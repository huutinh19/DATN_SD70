package com.poly.sport.service.cronJob;

import com.poly.sport.repository.VoucherRepository;
import com.poly.sport.service.KhuyenMaiService;
import com.poly.sport.service.VoucherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class VoucherCronJob {

    private static final Logger logger = LoggerFactory.getLogger(VoucherCronJob.class);
    private static final int NEAR_THRESHOLD_MINUTES = 5; // Ngưỡng thời gian gần (phút)

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private KhuyenMaiService khuyenMaiService;

    @Autowired
    private VoucherRepository voucherRepository;

//    @Scheduled(cron = "0 * * * * ?") // Chạy mỗi phút
//    @Transactional
//    public void checkVoucherStatus() {
//        try {
//            LocalDateTime now = LocalDateTime.now();
//            // Chỉ lấy các voucher chưa kết thúc (status != 2)
//            List<Voucher> activeVouchers = voucherRepository.findAllByStatusNot(2);
//
//            if (activeVouchers.isEmpty()) {
//                logger.debug("Không có voucher đang hoạt động để kiểm tra");
//                return;
//            }
//
//            for (Voucher voucher : activeVouchers) {
//                processVoucherStatus(voucher, now);
//            }
//            logger.debug("Đã kiểm tra {} voucher hoạt động", activeVouchers.size());
//        } catch (Exception e) {
//            logger.error("Lỗi khi kiểm tra trạng thái voucher", e);
//        }
//    }
//
//    @Scheduled(cron = "0 */5 * * * ?") // Chạy mỗi 5 phút
//    @Transactional
//    public void updateVoucherStatus() {
//        try {
//            voucherService.updateStatusVoucher();
//            logger.info("Đã cập nhật trạng thái tất cả voucher lúc: {}", LocalDateTime.now());
//        } catch (Exception e) {
//            logger.error("Lỗi khi cập nhật trạng thái định kỳ", e);
//        }
//    }
//
//    private void processVoucherStatus(Voucher voucher, LocalDateTime now) {
//        try {
//            LocalDateTime startDate = voucher.getStartDate();
//            LocalDateTime endDate = voucher.getEndDate();
//            long minutesToStart = ChronoUnit.MINUTES.between(now, startDate);
//            long minutesToEnd = ChronoUnit.MINUTES.between(now, endDate);
//
//            // Kiểm tra quantity = 0
//            if (voucher.getQuantity() == 0 && voucher.getStatus() != 2) {
//                endVoucher(voucher, now, "Hết số lượng");
//                return;
//            }
//
//            // Kiểm tra gần startDate
//            if (minutesToStart > 0 && minutesToStart <= NEAR_THRESHOLD_MINUTES && voucher.getStatus() == 0) {
//                voucher.setStatus(1);
//                voucherRepository.save(voucher);
//                logger.info("Voucher {} bắt đầu (còn {} phút)", voucher.getCode(), minutesToStart);
//                return;
//            }
//
//            // Kiểm tra gần endDate
//            if (minutesToEnd > 0 && minutesToEnd <= NEAR_THRESHOLD_MINUTES && voucher.getStatus() == 1) {
//                logger.info("Voucher {} sắp kết thúc (còn {} phút)", voucher.getCode(), minutesToEnd);
//            }
//
//            // Kiểm tra quá endDate
//            if (now.isAfter(endDate) && voucher.getStatus() != 2) {
//                endVoucher(voucher, now, "Hết hạn");
//            }
//        } catch (Exception e) {
//            logger.error("Lỗi khi xử lý voucher {}: {}", voucher.getCode(), e.getMessage());
//        }
//    }
//
//    private void endVoucher(Voucher voucher, LocalDateTime now, String reason) {
//        voucher.setStatus(2);
//        voucher.setEndDate(now);
//        voucherRepository.save(voucher);
//        logger.info("Voucher {} đã kết thúc: {}", voucher.getCode(), reason);
//    }

//
    @Scheduled(cron = "*/2 * * * * ?")// 2s chạy một lần
    public void autoUpdateStatusVoucher() {
        try {
            voucherService.updateStatusVoucher();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
//    @Scheduled(cron = "*/2 * * * * ?")// 2s chạy một lần
//    public void autoUpdateStatusPromotion() {
//        try {
//            khuyenMaiService.updateStatusPromotion();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }


}