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
    private String sole;
    private List<String> shoes;
    private List<String> colors;
    private List<String> sizes;
    private List<String> soles;
    private Boolean deleted;
    private String name;

}
