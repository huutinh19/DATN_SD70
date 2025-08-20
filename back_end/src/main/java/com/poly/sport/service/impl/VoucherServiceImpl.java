


package com.poly.sport.service.impl;

import com.poly.sport.entity.Voucher;
import com.poly.sport.infrastructure.common.GenCode;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.converter.VoucherConvert;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.VoucherRequest;
import com.poly.sport.infrastructure.response.VoucherResponse;
import com.poly.sport.repository.VoucherRepository;
import com.poly.sport.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class VoucherServiceImpl implements VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherConvert voucherConvert;


    public PhanTrang<VoucherResponse> getAll(VoucherRequest request) {
        return new PhanTrang<>(voucherRepository.getAllVoucher(request, PageRequest.of(request.getPage()-1 > 0 ? request.getPage()-1 : 0, request.getSizePage())));
    }

    private String genCode() {
        String prefix = "PGG0";
        int x = 1;
        String code = prefix + x;
        while (voucherRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }




    public Voucher getOne(Long id) {
        for (Voucher voucher : voucherRepository.findAll()) {
            updateStatus(voucher);
        }
        return voucherRepository.findById(id).get();
    }
    @Override
    @Transactional(rollbackFor = NgoaiLe.class)
    public Voucher add(VoucherRequest request) {
        if (request.getName().length() > 50) {
            throw new NgoaiLe("Tên phiếu giảm giá không được vượt quá 50 kí tự.");
        }
        if (request.getQuantity() <= 0) {
            throw new NgoaiLe("Số lượng phải lớn hơn 0.");
        }
        if (request.getQuantity() <= 0 || request.getQuantity() != (int) request.getQuantity() || request.getQuantity() == null) {
            throw new NgoaiLe("Số lượng phải là số nguyên dương.");
        }
        if(request.getQuantity()>10000){
            throw new NgoaiLe("Số lượng không được vượt quá 10000. ");
        }
        try {
            float percentReduce = Float.valueOf(request.getPercentReduce());
            if (percentReduce <= 0 || percentReduce > 80) {
                throw new NgoaiLe("Phần trăm giảm phải nằm trong khoảng từ 1 đến 80. ");
            }
        } catch (NumberFormatException e) {
            throw new NgoaiLe("Phần trăm giảm phải nằm trong khoảng từ 1 đến 80. ");
        } catch (NgoaiLe e) {
            throw e;
        }

//        if (Float.valueOf(request.getPercentReduce()) < 0 ) {
//            throw new NgoaiLe("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50. ");
//        }
        if (request.getMinBillValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new NgoaiLe("Đơn tối thiểu phải lớn hơn hoặc bằng 0. ");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new NgoaiLe("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
        if (request.getStartDate().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
            throw new NgoaiLe("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
        }
        if (request.getStartDate().isEqual(request.getEndDate())) {
            throw new NgoaiLe("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }
        request.setCode(genCode());
        Voucher voucher = voucherConvert.converRequestToEntity(request);
        Voucher voucherSave = voucherRepository.save(voucher);
        updateStatus(voucherSave);
        return voucher;

    }


    @Override
    public Voucher update(Long id, VoucherRequest request) {
        Voucher voucherToUpdate = voucherRepository.findById(id).orElse(null);
        if (request.getName().length() > 50) {
            throw new NgoaiLe("Tên phiếu giảm giá không được vượt quá 50 kí tự.");
        }
        if (request.getQuantity() <= 0) {
            throw new NgoaiLe("Số lượng phải lớn hơn 0. ");
        }
        if(request.getQuantity()>10000){
            throw new NgoaiLe("Số lượng không được vượt quá 10000. ");
        }
        if (request.getQuantity() <= 0 || request.getQuantity() != (int) request.getQuantity() || request.getQuantity() == null) {
            throw new NgoaiLe("Số lượng phải là số nguyên dương.");
        }
        if (Float.valueOf(request.getPercentReduce()) < 0 || Float.valueOf(request.getPercentReduce()) > 80) {
            throw new NgoaiLe("Phần trăm giảm phải nằm trong khoảng từ 1 đến 80. ");
        }
        if (!String.valueOf(request.getPercentReduce()).matches("^-?\\d+(\\.\\d+)?$")) {
            throw new NgoaiLe("Phần trăm giảm phải là số");
        }
        if (request.getMinBillValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new NgoaiLe("Đơn tối thiểu phải lớn hơn hoặc bằng 0. ");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new NgoaiLe("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
        Voucher voucherSave = voucherRepository.save(voucherConvert.convertRequestToEntity(id, request));
        if (voucherSave != null) {
            updateStatus(voucherToUpdate);
        }

        return voucherSave;
    }



    public String delete(Long id) {
        voucherRepository.deleteById(id);
        return "Xóa oke";


    }


    public boolean isVoucherCodeExists(String code) {
        return voucherRepository.existsByCode(code);
    }

    public void updateStatusVoucher() {
        LocalDateTime currentDateTime = LocalDateTime.now();
        List<Voucher> vouchers = voucherRepository.findAll();
        for (Voucher voucher : vouchers) {
            LocalDateTime startDate = voucher.getStartDate();
            LocalDateTime endDate = voucher.getEndDate();
            // so luong bang 0 thi se ket thuc voucher som
            if (voucher.getQuantity() == 0) {
                voucher.setStatus(2); // Đã kết thúc
//                voucher.setEndDate(currentDateTime);
            } else {
                if (voucher.getQuantity() > 0) {
                    voucher.setStatus(1); // Đang diễn ra
                }
                if (currentDateTime.isBefore(startDate)) {
                    voucher.setStatus(0); // Chưa bắt đầu
                } else if (currentDateTime.isAfter(startDate) && currentDateTime.isBefore(endDate)) {
                    voucher.setStatus(1); // Đang diễn ra
                } else {
                    voucher.setStatus(2); // Đã kết thúc
//                voucher.setDeleted(true);
                }


                if (endDate.isEqual(startDate)) {
                    voucher.setStatus(2); // Đã kết thúc
//                voucher.setDeleted(true);
                }
            }
            voucherRepository.save(voucher);
        }
    }
    @Override
    public Voucher updateEndDate(Long id) {
        Voucher voucherToUpdate = voucherRepository.findById(id).orElse(null);
        LocalDateTime currentDate = LocalDateTime.now();
        if(voucherToUpdate.getStatus()==2) {
            throw new NgoaiLe("Phiếu giảm giá này đã kết thúc rồi!");
        }
        if(voucherToUpdate.getStatus()==0){
            LocalDateTime startDate = currentDate.with(LocalTime.MIN);
            voucherToUpdate.setStartDate(startDate);
        }
        voucherToUpdate.setEndDate(currentDate);
        voucherToUpdate.setStatus(2); // Đã kết thúc
        return voucherRepository.save(voucherToUpdate);

    }

//    public void updateStatus() {
//        LocalDateTime currentDateTime = LocalDateTime.now();
//        List<Voucher> vouchers = voucherRepository.findAll();
//
//        for (Voucher voucher : vouchers) {
//            LocalDateTime startDate = voucher.getStartDate();
//            LocalDateTime endDate = voucher.getEndDate();
//
//            if (currentDateTime.isBefore(startDate)) {
//                voucher.setStatus(0); // Chưa bắt đầu
//            } else if (currentDateTime.isAfter(startDate) && currentDateTime.isBefore(endDate)) {
//                voucher.setStatus(1); // Đang diễn ra
//            } else {
//                voucher.setStatus(2); // Đã kết thúc
//                voucher.setDeleted(true);
//            }
//            voucherRepository.save(voucher);
//        }
//
//
//    }


    public void updateStatus(Voucher voucher) {
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime startDate = voucher.getStartDate();
        LocalDateTime endDate = voucher.getEndDate();

        if (currentDate.isBefore(startDate)) {
            voucher.setStatus(0); // Chưa bắt đầu
        } else if (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) {
            voucher.setStatus(1); // Đang diễn ra
        } else {
            voucher.setStatus(2); // Đã kết thúc
            voucher.setDeleted(true);
        }
        voucherRepository.save(voucher);
    }


    public void createScheduledVoucher() {
        // Lấy ngày hiện tại
        LocalDateTime currentDateTime = LocalDateTime.now();

        // set name voucher theo ngày tạo
        String voucherName = "Voucher ngày" + currentDateTime.format(DateTimeFormatter.ofPattern("dd/MM"));

        // Đặt startDate vào 00:00:00 của ngày hiện tại
        LocalDateTime startDate = currentDateTime.with(LocalTime.MIN);

        // Đặt endDate vào 23:59:59 của ngày hiện tại
        LocalDateTime endDate = currentDateTime.with(LocalTime.MAX);

        // logic
        Voucher voucher = new Voucher();
        voucher.setCode(GenCode.randomCodeVoucher());
        voucher.setName(voucherName);
        voucher.setStartDate(startDate);
        voucher.setEndDate(endDate);
        voucher.setMinBillValue(BigDecimal.valueOf(10000));
        voucher.setPercentReduce(Float.valueOf(5));
        voucher.setQuantity(100);
        updateStatus(voucher);
//        System.out.println("Voucher: " + voucherName + "");
    }


    private boolean isNumeric(String str) {
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
