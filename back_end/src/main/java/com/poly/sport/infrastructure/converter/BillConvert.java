package com.poly.sport.infrastructure.converter;

import com.poly.sport.entity.Bill;
import com.poly.sport.infrastructure.request.bill.BillRequest;
import com.poly.sport.repository.AccountRepository;
import com.poly.sport.repository.IBillRepository;
import com.poly.sport.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BillConvert {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private IBillRepository billRepository;

    public String genBillCode() {
        String prefix = "Hoá đơn ";
        int x = 1;
        String code = prefix + x;
        while (billRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        System.out.println(code);
        return code;
    }

    public Bill convertRequestToEntity(Bill entity, BillRequest request) {
        if(request.getVoucher() != null){
            entity.setVoucher(voucherRepository.findById(request.getVoucher()).get());
            System.out.println(request.getVoucher());
        }
        if(request.getCustomer() != null){
            entity.setCustomer(accountRepository.findById(request.getCustomer()).get());
        }
        entity.setCustomerName(request.getCustomerName());
        entity.setPhoneNumber(request.getPhoneNumber());
        entity.setAddress(request.getAddress());
        entity.setMoneyShip(request.getMoneyShip());
        entity.setMoneyReduce(request.getMoneyReduce());
        entity.setTotalMoney(request.getTotalMoney().subtract(request.getMoneyReduce()));
        entity.setNote(request.getNote());
        entity.setStatus(request.getStatus());
        entity.setType(request.getType());
        return entity;
    }
}
