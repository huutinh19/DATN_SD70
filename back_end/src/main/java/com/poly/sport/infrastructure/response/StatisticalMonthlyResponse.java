package com.poly.sport.infrastructure.response;

import org.springframework.beans.factory.annotation.Value;

public interface StatisticalMonthlyResponse {

    @Value("#{target.totalBill}")
    Integer getTotalBill();

    @Value("#{target.totalBillAmount}")
    Integer getTotalBillAmount();

    @Value("#{target.totalProduct}")
    Integer getTotalProduct();
}
