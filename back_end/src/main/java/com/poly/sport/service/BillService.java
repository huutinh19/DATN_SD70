package com.poly.sport.service;

import com.poly.sport.entity.Bill;
import com.poly.sport.entity.BillHistory;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;

import com.poly.sport.infrastructure.request.BillClientRequest;
import com.poly.sport.infrastructure.request.bill.BillRequest;
import com.poly.sport.infrastructure.request.bill.BillSearchRequest;
import com.poly.sport.infrastructure.response.BillResponse;
import com.poly.sport.infrastructure.response.StatisticBillStatus;


import java.time.LocalDateTime;
import java.util.List;

public interface BillService {
    PhanTrang<BillResponse> getAll(BillSearchRequest request);
    Bill getOne(Long id);
    Bill create();
    Bill update(Long id, BillRequest request);
    List<Bill> getNewBill(BillSearchRequest request);
    Bill orderBill(Long id, BillRequest request);
    Bill changeStatus(Long id, String note, Boolean isCancel, Boolean isVnpay);

    Bill findByCode(String code);
    Bill changeInfoCustomer(Long id, BillRequest request);
    List<BillHistory> getBillHistory(Long billId);

    Bill updateVoucher(Long billId, Long newVoucherId);

    List<StatisticBillStatus> statisticBillStatus();
    List<StatisticBillStatus> statisticBillStatusByDateRange(LocalDateTime fromDate, LocalDateTime toDate);
    ResponseObject createBillClient(BillClientRequest request);
    ResponseObject createBillClientVnpay(BillClientRequest request, String code);
}
