package com.poly.sport.service.impl;

import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.FindShoeDetailRequest;
import com.poly.sport.infrastructure.request.bill.BillSearchRequest;
import com.poly.sport.infrastructure.response.*;
import com.poly.sport.repository.IBillRepository;
import com.poly.sport.service.ThongKeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

@Service
public class ThongKeServiceImpl implements ThongKeService {
    private final long currentTimeMillis = System.currentTimeMillis();
    private final Date currentDate = new Date(currentTimeMillis);

    @Autowired
    private IBillRepository iBillRepository;

    @Override
    public List<StatisticalDayResponse> getAllStatisticalDay() {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN); // 00:00:00
        LocalDateTime endOfDayPlusOne = startOfDay.plusDays(1); // 00:00:00 of next day
        Long startOfDayMillis = startOfDay.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        Long endOfDayPlusOneMillis = endOfDayPlusOne.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        return iBillRepository.getAllStatisticalDay(startOfDayMillis, endOfDayPlusOneMillis);
    }

    @Override
    public List<StatisticalWeeklyResponse> getAllStatisticalWeek() {
        return iBillRepository.getAllStatisticalWeekly(getStartOfWeek(), getEndOfWeek());
    }

    @Override
    public List<StatisticalMonthlyResponse> getAllStatisticalMonth() {
        return iBillRepository.getAllStatisticalMonthly(getStartMonth(), getEndMonth());
    }

    @Override
    public List<StatisticalYearlyResponse> getAllStatisticalYear() {
        return iBillRepository.getAllStatisticalYearly(getStartOfYear(), getEndOfYear());
    }

    @Override
    public List<StatisticalCustomResponse> getStatisticalCustom(Long fromDate, Long toDate) {
        return iBillRepository.getStatisticalCustom(fromDate, toDate);
    }

    @Override
    public PhanTrang<BillResponse> getStatisticalByDateRange(BillSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PhanTrang<>(iBillRepository.getStatisticalByDateRange(request, pageable));
    }

    @Override
    public PhanTrang<SanPhamChiTietReponse> getNearExpiredProducts(FindShoeDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PhanTrang<>(iBillRepository.getNearExpiredProducts(request, pageable));
    }

    private Long getStartOfToday() {
        Calendar calendarStart = Calendar.getInstance();
        calendarStart.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendarStart.setTime(currentDate);
        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
        calendarStart.set(Calendar.MINUTE, 0);
        calendarStart.set(Calendar.SECOND, 0);
        calendarStart.set(Calendar.MILLISECOND, 0);
        return calendarStart.getTimeInMillis();
    }

    private Long getEndOfToday() {
        Calendar calendarEnd = Calendar.getInstance();
        calendarEnd.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendarEnd.setTime(currentDate);
        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
        calendarEnd.set(Calendar.MINUTE, 59);
        calendarEnd.set(Calendar.SECOND, 59);
        calendarEnd.set(Calendar.MILLISECOND, 999);
        return calendarEnd.getTimeInMillis();
    }

    private Long getStartOfWeek() {
        Calendar calendarStart = Calendar.getInstance();
        calendarStart.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendarStart.setTime(currentDate);
        calendarStart.set(Calendar.DAY_OF_WEEK, calendarStart.getFirstDayOfWeek());
        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
        calendarStart.set(Calendar.MINUTE, 0);
        calendarStart.set(Calendar.SECOND, 0);
        calendarStart.set(Calendar.MILLISECOND, 0);
        return calendarStart.getTimeInMillis();
    }

    private Long getEndOfWeek() {
        Calendar calendarEnd = Calendar.getInstance();
        calendarEnd.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendarEnd.setTime(currentDate);
        calendarEnd.set(Calendar.DAY_OF_WEEK, calendarEnd.getFirstDayOfWeek() + 6);
        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
        calendarEnd.set(Calendar.MINUTE, 59);
        calendarEnd.set(Calendar.SECOND, 59);
        calendarEnd.set(Calendar.MILLISECOND, 999);
        return calendarEnd.getTimeInMillis();
    }

    private Long getStartMonth() {
        Calendar calendarStart = Calendar.getInstance();
        calendarStart.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendarStart.setTime(currentDate);
        calendarStart.set(Calendar.DAY_OF_MONTH, 1);
        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
        calendarStart.set(Calendar.MINUTE, 0);
        calendarStart.set(Calendar.SECOND, 0);
        calendarStart.set(Calendar.MILLISECOND, 0);
        return calendarStart.getTimeInMillis();
    }

    private Long getEndMonth() {
        Calendar calendarEnd = Calendar.getInstance();
        calendarEnd.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendarEnd.setTime(currentDate);
        calendarEnd.set(Calendar.DAY_OF_MONTH, calendarEnd.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
        calendarEnd.set(Calendar.MINUTE, 59);
        calendarEnd.set(Calendar.SECOND, 59);
        calendarEnd.set(Calendar.MILLISECOND, 999);
        return calendarEnd.getTimeInMillis();
    }

    private Long getStartOfYear() {
        Calendar calendarStart = Calendar.getInstance();
        calendarStart.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendarStart.setTime(currentDate);
        calendarStart.set(Calendar.DAY_OF_YEAR, 1);
        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
        calendarStart.set(Calendar.MINUTE, 0);
        calendarStart.set(Calendar.SECOND, 0);
        calendarStart.set(Calendar.MILLISECOND, 0);
        return calendarStart.getTimeInMillis();
    }

    private Long getEndOfYear() {
        Calendar calendarEnd = Calendar.getInstance();
        calendarEnd.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendarEnd.setTime(currentDate);
        calendarEnd.set(Calendar.DAY_OF_YEAR, calendarEnd.getActualMaximum(Calendar.DAY_OF_YEAR));
        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
        calendarEnd.set(Calendar.MINUTE, 59);
        calendarEnd.set(Calendar.SECOND, 59);
        calendarEnd.set(Calendar.MILLISECOND, 999);
        return calendarEnd.getTimeInMillis();
    }

}