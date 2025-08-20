package com.poly.sport.controller.client;

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
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/client/api/bill")
public class BillControllerClient {
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

    @GetMapping("/find-by-code")
    public Bill findByCode(@RequestParam(required = false, defaultValue = "") String code) {
        return billService.findByCode(code);
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
    public ResponseObject changeStatus(@PathVariable Long id, @RequestParam String note, @RequestParam Boolean isCancel,@RequestParam Boolean isVnpay) {
        return new ResponseObject(billService.changeStatus(id, note, isCancel,isVnpay));
    }

    @PostMapping("/create-bill-client")
    public ResponseObject create(@RequestBody BillClientRequest request) {
        return new ResponseObject(billService.createBillClient(request));
    }

    @PostMapping("/create-bill-client-vn-pay/{code}")
    public ResponseObject createVnPay(@RequestBody BillClientRequest request,
                                      @PathVariable("code") String code) {
        return new ResponseObject(billService.createBillClientVnpay(request, code));
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

    // Thêm endpoint mới để lấy lịch sử trạng thái bill
    @GetMapping("/{id}/history")
    public ResponseObject getBillHistory(@PathVariable Long id) {
        List<BillHistory> history = billService.getBillHistory(id);
        return new ResponseObject(history);
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