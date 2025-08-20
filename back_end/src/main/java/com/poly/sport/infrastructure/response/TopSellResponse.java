package com.poly.sport.infrastructure.response;

public interface TopSellResponse {
    String getName();
    String getImages();
    Long getMinPrice();
    Long getMaxPrice();
    String getBrand();
    String getCategory();
    String getSole();
    Long getQuantitySold();
}
