


package com.poly.sport.service;

import com.poly.sport.entity.Voucher;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.VoucherRequest;
import com.poly.sport.infrastructure.response.VoucherResponse;

public interface VoucherService {
    PhanTrang<VoucherResponse> getAll(VoucherRequest request);
    Voucher getOne(Long id);

    Voucher add(VoucherRequest voucher);

    Voucher update(Long id, VoucherRequest voucher);

    String delete(Long id);

    boolean isVoucherCodeExists(String code);
    void updateStatusVoucher();

    Voucher updateEndDate(Long id);



    void createScheduledVoucher();
}
