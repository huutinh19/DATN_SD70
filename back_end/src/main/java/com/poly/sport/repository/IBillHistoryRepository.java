package com.poly.sport.repository;

import com.poly.sport.entity.BillHistory;
import com.poly.sport.infrastructure.response.BillHistoryResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IBillHistoryRepository extends JpaRepository<BillHistory, Long> {
    @Query(value = """
            SELECT ROW_NUMBER() OVER(ORDER BY bh.create_at ASC) AS indexs,
            bh.id AS id,
            bh.ghi_chu AS note, bh.status AS status,
            bh.create_at AS createAt,
            bh.create_by AS createBy
            FROM lich_su_hoa_don bh WHERE bh.hoa_don_id = :#{#idBill}
            """, nativeQuery = true)
    List<BillHistoryResponse> getByBill(@Param("idBill") Long idBill);

    List<BillHistory> findByBillId(Long billId);

}
