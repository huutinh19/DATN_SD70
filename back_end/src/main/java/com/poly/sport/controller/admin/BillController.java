package com.poly.sport.controller.admin;

import com.poly.sport.entity.Bill;
import com.poly.sport.entity.BillHistory;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.BillClientRequest;
import com.poly.sport.infrastructure.request.bill.BillRequest;
import com.poly.sport.infrastructure.request.bill.BillSearchRequest;
import com.poly.sport.infrastructure.response.StatisticBillStatus;
import com.poly.sport.service.BillService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bill")
public class BillController {
    @Autowired
    private BillService billService;

    @GetMapping
    public PhanTrang getAll(BillSearchRequest request) {
        return billService.getAll(request);
    }

    @GetMapping("/{id}")
    public Bill getOne(@PathVariable Long id) {
        return billService.getOne(id);
    }

    @PostMapping
    public ResponseObject create() {
        return new ResponseObject(billService.create());
    }

    @PutMapping("/{id}")
    public ResponseObject orderBill(@PathVariable Long id, @RequestBody @Valid BillRequest request) {
        return new ResponseObject(billService.orderBill(id, request));
    }

    @GetMapping("/change-status/{id}")
    public ResponseObject changeStatus(@PathVariable Long id, @RequestParam String note, @RequestParam Boolean isCancel,
                                       @RequestParam(required = false) Boolean isVnpay) {
        return new ResponseObject(billService.changeStatus(id, note, isCancel,isVnpay));
    }

    @GetMapping("/new-bill")
    public List<Bill> getNewBill(BillSearchRequest request) {
        return billService.getNewBill(request);
    }

    @GetMapping("/statistic-bill-status")
    public List<StatisticBillStatus> statisticBillStatus() {
        return billService.statisticBillStatus();
    }

    @PutMapping("/change-info-customer/{id}")
    public ResponseObject changeInfoCustomer(@PathVariable Long id, @RequestBody BillRequest request) {
        return new ResponseObject(billService.changeInfoCustomer(id, request));
    }

    @PostMapping("/create-bill-client")
    public ResponseObject create(@RequestBody BillClientRequest request) {
        return new ResponseObject(billService.createBillClient(request));
    }

    // Thêm endpoint mới để tìm hóa đơn theo mã
    @GetMapping("/find-by-code")
    public ResponseEntity<Bill> findByCode(@RequestParam String code) {
        Bill bill = billService.findByCode(code);
        if (bill != null) {
            return ResponseEntity.ok(bill);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Thêm endpoint mới để lấy lịch sử trạng thái bill
    @GetMapping("/{id}/history")
    public ResponseObject getBillHistory(@PathVariable Long id) {
        List<BillHistory> history = billService.getBillHistory(id);
        return new ResponseObject(history);
    }

    @PutMapping("/update-voucher/{id}")
    public ResponseEntity<Bill> updateVoucher(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        Long voucherId = request.get("voucherId");
        Bill updatedBill = billService.updateVoucher(id, voucherId);
        return ResponseEntity.ok(updatedBill);
    }

    @GetMapping("/statistic-bill-status-by-date")
    public List<StatisticBillStatus> statisticBillStatusByDateRange(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        LocalDateTime from = null;
        LocalDateTime to = null;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        if (fromDate != null && !fromDate.isEmpty()) {
            from = LocalDateTime.parse(fromDate, formatter);
        }
        if (toDate != null && !toDate.isEmpty()) {
            to = LocalDateTime.parse(toDate, formatter);
        }

        return billService.statisticBillStatusByDateRange(from, to);
    }


}