package com.poly.sport.repository;

import com.poly.sport.entity.PaymentMethod;
import com.poly.sport.infrastructure.response.PaymentMethodResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IPaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    @Query(value = """
            SELECT ROW_NUMBER() OVER(ORDER BY pm.create_at ASC) AS indexs,
            pm.id AS id,
            pm.phuong_thuc_thanh_toan AS method,
            pm.tong_tien AS totalMoney,
            pm.ghi_chu AS note,
            pm.ma_giao_dich AS tradingCode,
            pm.create_by AS createBy,
            pm.create_at AS createAt,
            pm.type AS type
            FROM phuong_thuc_thanh_toan pm
            WHERE pm.hoa_don_id = :idBill
            """, nativeQuery = true)
    List<PaymentMethodResponse> getByBill(@Param("idBill") Long idBill);

    Boolean existsByBillId(Long id);
    List<PaymentMethod> findByBillIdAndType(Long idBill, Boolean type);
}