package com.poly.sport.controller.client;

import com.poly.sport.entity.Images;
import com.poly.sport.entity.SanPham;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.request.FindSanPhamRequest;
import com.poly.sport.infrastructure.request.SanPhamRequest;
import com.poly.sport.infrastructure.response.SanPhamKhuyenMaiRespone;
import com.poly.sport.infrastructure.response.SanPhamResponse;
import com.poly.sport.repository.AnhRepository;
import com.poly.sport.service.SanPhamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/client/api/shoe")
public class SanPhamControllerClient {

    @Autowired
    private SanPhamService sanPhamService;

    @Autowired
    private AnhRepository anhRepository;

    @GetMapping
    public PhanTrang<SanPhamResponse> getAll(FindSanPhamRequest request) {
        return sanPhamService.getAll(request);
    }


    @GetMapping("/shoe-promotion")
    public List<SanPhamKhuyenMaiRespone> getTest(@RequestParam(required = false) Long promotion){
        return sanPhamService.getAllShoeInPromotion(promotion);
    }
    @GetMapping("/{id}")
    public SanPham getOne(@PathVariable Long id) {
        return sanPhamService.getOne(id);
    }
    @GetMapping("/{id}/images")
    public List<String> getImagesBySanPhamId(@PathVariable Long id) {
        return anhRepository.findBySanPhamId(id).stream()
                .map(Images::getName)
                .collect(Collectors.toList());
    }


@PostMapping(consumes = {"multipart/form-data"})
public ResponseObject create(@ModelAttribute @Valid SanPhamRequest request) {
    return new ResponseObject(sanPhamService.create(request));
}


@PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
public ResponseObject update(@PathVariable Long id, @ModelAttribute @Valid SanPhamRequest request) {
    return new ResponseObject(sanPhamService.update(id, request));
}

    @DeleteMapping("/{id}")
    public ResponseObject changeStatus(@PathVariable Long id){
        return new ResponseObject(sanPhamService.changeStatus(id));
    }

//    @GetMapping("/top-sell")
//    public List<SanPhamResponse> getTopSell(@RequestParam(required = false, defaultValue = "5") Integer top){
//        return sanPhamService.getTopSell(top);
//    }
@GetMapping("/top-sell")
public List<SanPhamResponse> getTopSell(
        @RequestParam(required = false, defaultValue = "5") Integer top,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime endDate
) {
    if (startDate != null && endDate != null) {
        // Convert OffsetDateTime to LocalDateTime in Vietnam timezone for the query
        return sanPhamService.getTopSellWithDateFilter(
                top,
                startDate.atZoneSameInstant(java.time.ZoneId.of("Asia/Ho_Chi_Minh")).toLocalDateTime(),
                endDate.atZoneSameInstant(java.time.ZoneId.of("Asia/Ho_Chi_Minh")).toLocalDateTime()
        );
    }
    return sanPhamService.getTopSell(top);
}
}
