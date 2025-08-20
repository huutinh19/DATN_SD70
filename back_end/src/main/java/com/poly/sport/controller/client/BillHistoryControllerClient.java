package com.poly.sport.controller.client;

import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.BillHistoryRequest;
import com.poly.sport.infrastructure.response.BillHistoryResponse;
import com.poly.sport.service.BillHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client/api/bill-history")
public class BillHistoryControllerClient {
    @Autowired
    private BillHistoryService billHistoryService;
    @GetMapping("/{idBill}")
    public List<BillHistoryResponse> getByBill(@PathVariable("idBill") Long id){
        return billHistoryService.getByBill(id);
    }
    @PostMapping
    public ResponseObject create(@RequestBody BillHistoryRequest request){
        return billHistoryService.create(request);
    }
}
