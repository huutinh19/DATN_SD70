package com.poly.sport.infrastructure.common;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class PageableRequest {
    private int page = PhanTrangConstant.DEFAULT_PAGE;
    private int sizePage = PhanTrangConstant.DEFAULT_SIZE;
}