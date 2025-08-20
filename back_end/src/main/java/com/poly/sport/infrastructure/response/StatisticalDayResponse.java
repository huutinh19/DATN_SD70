package com.poly.sport.infrastructure.response;

import org.springframework.beans.factory.annotation.Value;

public interface StatisticalDayResponse {

    @Value("#{target.totalBillToday}")
    Integer getTotalBillToday();
    @Value("#{target.totalBillAmountToday}")
    Integer getTotalBillAmountToday();

    @Value("#{target.totalProduct}")
    Integer getTotalProduct();
}
