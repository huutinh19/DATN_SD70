package com.poly.sport.infrastructure.request;

import com.poly.sport.infrastructure.common.PageableRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class FindSanPhamRequest extends PageableRequest {
    private Long id;
    private String name;
    private String color;
    private String size;
    private String xuatXu;
    private String thuongHieu;
    private String coAo;
    private String tayAo;
    private String chatLieu;
    private List<String> xuatXus;
    private List<String> thuongHieus;
    private List<String> coAos;
    private List<String> tayAos;
    private List<String> chatLieus;
    private List<String> colors;
    private List<String> sizes;

    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean status;
}
