package com.poly.sport.infrastructure.request;

import com.poly.sport.infrastructure.common.PageableRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class FindShoeDetailRequest extends PageableRequest {
    private Long id;
    private String shoe;
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
    private List<String> shoes;
    private List<String> colors;
    private List<String> sizes;

    private Boolean deleted;
    private String name;

}
