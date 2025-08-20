package com.poly.sport.repository;

import com.poly.sport.entity.Bill;
import com.poly.sport.infrastructure.request.FindShoeDetailRequest;
import com.poly.sport.infrastructure.request.bill.BillSearchRequest;
import com.poly.sport.infrastructure.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IBillRepository extends JpaRepository<Bill, Long> {

    Boolean existsByCodeIgnoreCase(String code);

    @Query(value = """
            SELECT  b.id AS id,
            ROW_NUMBER() OVER(ORDER BY b.update_at DESC) AS indexs,
            b.code AS code, b.create_at AS createAt,
            cus.name AS customer, emp.name AS employee,
            b.ten_khach_hang AS customerName,
            b.dia_chi AS address,
            b.sdt AS phoneNumber,
            b.tong_tien AS totalMoney,
            b.tien_ship AS moneyShip,
            b.tien_giam AS moneyReduce,
            b.ngay_thanh_toan AS payDate,
            b.ngay_giao_hang AS shipDate,
            b.ngay_du_kien AS desiredDate,
            b.ngay_nhan AS receiveDate,
            b.type AS type,
            b.status AS status,
            b.ghi_chu AS note,
            v.code AS voucher
            FROM hoa_don b
            LEFT JOIN account emp ON emp.id = b.account_id
            LEFT JOIN account cus ON cus.id = b.customer_id
            LEFT JOIN voucher v ON v.id = b.voucher_id
            WHERE (:#{#req.code} IS NULL OR b.code LIKE %:#{#req.code}%
            OR b.ten_khach_hang LIKE %:#{#req.code}% OR b.sdt LIKE %:#{#req.code}%)
            AND ((:#{#req.idStaff} IS NULL OR b.account_id = :#{#req.idStaff}) OR (b.account_id IS NULL))
            AND (:#{#req.status} IS NULL OR b.status = :#{#req.status})
            AND (:#{#req.idCustomer} IS NULL OR b.customer_id = :#{#req.idCustomer})
            AND (:#{#req.fromDate} IS NULL OR :#{#req.toDate} IS NULL OR (b.update_at BETWEEN :#{#req.fromDate} AND :#{#req.toDate}))
            AND b.deleted = FALSE AND b.status NOT IN (1)
            """, nativeQuery = true)
    Page<BillResponse> getAll(@Param("req") BillSearchRequest request, Pageable pageable);



    @Query("""
            SELECT b
            FROM Bill b
            WHERE (:#{#req.code} IS NULL OR b.code LIKE %:#{#req.code}%)
            AND (:#{#req.idStaff} IS NULL OR b.account.id = :#{#req.idStaff})
            AND (:#{#req.status} IS NULL OR b.status = :#{#req.status})
            AND b.deleted = FALSE 
            AND b.status = 1
            ORDER BY b.createAt DESC
            """)
    List<Bill> getNewBill(@Param("req") BillSearchRequest request);

    Bill findByCode(String code);

    Boolean existsByCode(String code);

    Page<Bill> findByAccountIdAndStatusAndDeletedFalse(Long idAccount, Integer status, Pageable pageable);



    @Query(value = """
             SELECT b.id AS id,
               ROW_NUMBER() OVER(ORDER BY b.update_by DESC) AS indexs,
               b.code AS code,
               b.create_at AS createAt,
               b.ten_khach_hang AS customerName,
               b.dia_chi AS address,
               b.sdt AS phoneNumber,
               b.tong_tien AS totalMoney,
               b.tien_ship AS moneyShip,
               b.tien_giam AS moneyReduce,
               b.ngay_thanh_toan AS payDate,
               b.ngay_giao_hang AS shipDate,
               b.ngay_du_kien AS desiredDate,
               b.ngay_nhan AS receiveDate,
               b.type AS type,
               b.status AS status,
               b.ghi_chu AS note
        FROM hoa_don b
        WHERE b.status = '6'
          AND (:#{#req.fromDate} IS NULL OR :#{#req.toDate} IS NULL OR (b.update_by BETWEEN :#{#req.fromDate} AND :#{#req.toDate}))
        """, nativeQuery = true)
    Page<BillResponse> getStatisticalByDateRange(@Param("req") BillSearchRequest request, Pageable pageable);

    @Query(value = """
    SELECT
        sd.id AS id,
        ROW_NUMBER() OVER(ORDER BY s.update_by DESC) AS indexs,
        CONCAT(s.name) AS name,
        sd.code AS code,
        c.name AS color,
        sz.name AS size,
        sd.so_luong AS quantity,
        sd.can_nang AS weight,
        sd.gia AS price,
        GROUP_CONCAT(DISTINCT img.name ORDER BY img.create_at ASC) AS images,
        sd.deleted AS status
    FROM chi_tiet_san_pham sd
    LEFT JOIN san_pham s ON sd.san_pham_id = s.id
    LEFT JOIN mau_sac c ON sd.mau_sac_id = c.id
    LEFT JOIN kich_co sz ON sd.kich_co_id = sz.id
    LEFT JOIN images img ON img.san_pham_id = s.id
    WHERE
        (:#{#req.shoe} IS NULL OR sd.san_pham_id IN (:#{#req.shoes}))
        AND (:#{#req.color} IS NULL OR :#{#req.color} = '' OR sd.mau_sac_id IN (:#{#req.colors}))
        AND (:#{#req.size} IS NULL OR :#{#req.size} = '' OR sd.kich_co_id IN (:#{#req.sizes}))
        AND (:#{#req.name} IS NULL OR :#{#req.name} = '' OR s.name LIKE %:#{#req.name}%)
        AND sd.so_luong < 10  -- Products with quantity less than 10
    GROUP BY
        sd.id, s.update_by, s.name, c.name, sz.name, sd.code, sd.so_luong, sd.can_nang, sd.gia, sd.deleted
""", nativeQuery = true)
    Page<SanPhamChiTietReponse> getNearExpiredProducts(@Param("req") FindShoeDetailRequest request, Pageable pageable);

    @Query(value = """
           SELECT
           CASE
               WHEN status = 2 THEN 'Chờ xác nhận'
                WHEN status = 9 THEN 'Đã xác nhận'
                WHEN status = 10 THEN 'Đã giao hàng'
               WHEN status = 3 THEN 'Xác nhận thông tin thanh toán'
               WHEN status = 4 THEN 'Chờ giao hàng'
               WHEN status = 5 THEN 'Đang giao hàng'
               WHEN status = 6 THEN 'Hoàn thành'
               WHEN status = 7 THEN 'Đã hủy'
               WHEN status = 8 THEN 'Trả hàng'
               WHEN status = 9 THEN 'Đã xác nhận'
               WHEN status = 10 THEN 'Đã giao hàng'
               ELSE 'Chờ thanh toán'
           END AS statusName,
           status AS status,
           COUNT(*) AS totalCount
           FROM hoa_don b
           WHERE b.status NOT IN (1)
           GROUP BY status
           ORDER BY status
            """, nativeQuery = true)
    List<StatisticBillStatus> statisticBillStatus();


    @Query(value = """
    SELECT
        COUNT(DISTINCT b.id) AS totalBillToday,
        SUM(b.tong_tien) AS totalBillAmountToday,
        SUM(bd.so_luong) AS totalProduct
    FROM hoa_don b JOIN hoa_don_chi_tiet bd ON b.id = bd.hoa_don_id
    WHERE b.ngay_nhan >= :startOfDay AND b.ngay_nhan <= :endOfDay 
    AND b.status IN ('8', '6')                   
    """, nativeQuery = true)
    List<StatisticalDayResponse> getAllStatisticalDay(@Param("startOfDay") Long startOfDay,
                                                      @Param("endOfDay") Long endOfDay);
    @Query(value = """
            SELECT
                COUNT(DISTINCT b.id) AS totalBill,
                SUM(b.tong_tien) AS totalBillAmount,
                SUM(bd.so_luong) AS totalProduct
            FROM hoa_don b JOIN hoa_don_chi_tiet bd ON b.id = bd.hoa_don_id
            WHERE b.status IN ('8', '6') AND b.ngay_nhan >= :startOfMonth AND b.ngay_nhan <= :endOfMonth
              """, nativeQuery = true)
    List<StatisticalMonthlyResponse> getAllStatisticalMonthly(@Param("startOfMonth") Long startOfMonth,
                                                              @Param("endOfMonth") Long endOfMonth);

    @Query(value = """
                SELECT
                    COUNT(DISTINCT b.id) AS totalBill,
                    SUM(b.tong_tien) AS totalBillAmount,
                    SUM(bd.so_luong) AS totalProduct
                FROM hoa_don b JOIN hoa_don_chi_tiet bd ON b.id = bd.hoa_don_id
                WHERE b.ngay_nhan >= :startOfWeek AND b.ngay_nhan <= :endOfWeek 
                AND b.status IN ('8', '6')                   
                          """, nativeQuery = true)
    List<StatisticalWeeklyResponse> getAllStatisticalWeekly(@Param("startOfWeek") Long startOfWeek,
                                                            @Param("endOfWeek") Long endOfWeek);

    @Query(value = """
            SELECT
                COUNT(DISTINCT b.id) AS totalBill,
                SUM(b.tong_tien) AS totalBillAmount,
                SUM(bd.so_luong) AS totalProduct
            FROM hoa_don b JOIN hoa_don_chi_tiet bd ON b.id = bd.hoa_don_id
            WHERE b.status IN ('8', '6') AND b.ngay_nhan >= :startOfYear AND b.ngay_nhan <= :endOfYear
              """, nativeQuery = true)
    List<StatisticalYearlyResponse> getAllStatisticalYearly(@Param("startOfYear") Long startOfYear,
                                                            @Param("endOfYear") Long endOfYear);

    @Query(value = """
            SELECT
                COUNT(DISTINCT b.id) AS totalBill,
                SUM(b.tong_tien) AS totalBillAmount,
                SUM(bd.so_luong) AS totalProduct
            FROM hoa_don b JOIN hoa_don_chi_tiet bd ON b.id = bd.hoa_don_id
            WHERE b.status IN ('8', '6') AND b.ngay_nhan >= :fromDate AND b.ngay_nhan <= :toDate
              """, nativeQuery = true)
    List<StatisticalCustomResponse> getStatisticalCustom(@Param("fromDate") Long fromDate,
                                                         @Param("toDate") Long toDate);

    @Query(value = """
        SELECT
            s.id AS id,
            s.code AS code,
            s.name AS name,
            ROW_NUMBER() OVER(ORDER BY SUM(bd.so_luong) DESC) AS indexs,
            GROUP_CONCAT(DISTINCT c.name ORDER BY c.name) AS color,
            GROUP_CONCAT(DISTINCT sz.name ORDER BY sz.name) AS size,
            (SELECT GROUP_CONCAT(DISTINCT img.name ORDER BY img.create_at ASC)
             FROM images img
             WHERE img.san_pham_id = s.id) AS images,
            ct.name AS category,
            br.name AS brand,
            d.name AS sole,
            MAX(sd.gia) AS maxPrice,
            MIN(sd.gia) AS minPrice,
            SUM(bd.so_luong) AS quantitySold
        FROM san_pham s
        JOIN chi_tiet_san_pham sd ON s.id = sd.san_pham_id
        JOIN hoa_don_chi_tiet bd ON bd.chi_tiet_san_pham_id = sd.id
        JOIN hoa_don b ON b.id = bd.hoa_don_id
        LEFT JOIN mau_sac c ON c.id = sd.mau_sac_id
        LEFT JOIN kich_co sz ON sz.id = sd.kich_co_id
        LEFT JOIN danh_muc ct ON ct.id = s.danh_muc_id
        LEFT JOIN thuong_hieu br ON br.id = s.thuong_hieu_id
        LEFT JOIN de d ON d.id = s.de_id
        WHERE b.ngay_nhan >= :fromDate AND b.ngay_nhan <= :toDate
        AND (:status IS NULL OR b.status = :status)
        AND s.deleted = FALSE
        GROUP BY s.id, s.code, s.name, ct.name, br.name, d.name
        ORDER BY SUM(bd.so_luong) DESC
        LIMIT 10
    """, nativeQuery = true)
    List<TopSellResponse> getTopSellingProducts(@Param("fromDate") Long fromDate,
                                                @Param("toDate") Long toDate,
                                                @Param("status") Integer status);



    @Query(value = """
    SELECT
        CASE
            WHEN status = 2 THEN 'Chờ xác nhận'
            WHEN status = 9 THEN 'Đã xác nhận'
            WHEN status = 10 THEN 'Đã giao hàng'
            WHEN status = 3 THEN 'Xác nhận thông tin thanh toán'
            WHEN status = 4 THEN 'Chờ giao hàng'
            WHEN status = 5 THEN 'Đang giao hàng'
            WHEN status = 6 THEN 'Hoàn thành'
            WHEN status = 7 THEN 'Đã hủy'
            WHEN status = 8 THEN 'Trả hàng'
           
            ELSE 'Chờ thanh toán'
        END AS statusName,
        status AS status,
        COUNT(*) AS totalCount
    FROM hoa_don b
    WHERE b.status NOT IN (1)
    AND (:fromDate IS NULL OR :toDate IS NULL OR (b.update_at BETWEEN :fromDate AND :toDate))
    GROUP BY status
    ORDER BY status
""", nativeQuery = true)
    List<StatisticBillStatus> statisticBillStatusByDateRange(@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);

}