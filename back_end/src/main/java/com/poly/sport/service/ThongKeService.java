package com.poly.sport.service;

import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.FindShoeDetailRequest;
import com.poly.sport.infrastructure.request.bill.BillSearchRequest;
import com.poly.sport.infrastructure.response.*;

import java.util.List;

public interface ThongKeService {
    List<StatisticalDayResponse> getAllStatisticalDay();
    List<StatisticalWeeklyResponse> getAllStatisticalWeek();
    List<StatisticalMonthlyResponse> getAllStatisticalMonth();
    List<StatisticalYearlyResponse> getAllStatisticalYear();
    List<StatisticalCustomResponse> getStatisticalCustom(Long fromDate, Long toDate);
    PhanTrang<BillResponse> getStatisticalByDateRange(BillSearchRequest request);
    PhanTrang<SanPhamChiTietReponse> getNearExpiredProducts(FindShoeDetailRequest request);


}