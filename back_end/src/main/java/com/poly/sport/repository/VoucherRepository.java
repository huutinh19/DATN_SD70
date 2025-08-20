package com.poly.sport.repository;

import com.poly.sport.entity.Voucher;
import com.poly.sport.infrastructure.request.VoucherRequest;
import com.poly.sport.infrastructure.response.VoucherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher,Long> {




    @Query(value = """
            SELECT v.id AS id,
            ROW_NUMBER() OVER(ORDER BY v.create_at DESC) AS indexs,
            v.code AS code, v.name AS name,
            v.so_luong AS quantity, v.phan_tram_giam AS percentReduce,
            v.gia_tri_toi_thieu AS minBillValue,
            v.gia_tri_toi_da AS maxBillValue,
            v.status AS status,
            v.ngay_bat_dau AS startDate,
            v.ngay_ket_thuc AS endDate
            FROM voucher v
            WHERE (:#{#req.name} IS NULL OR :#{#req.name} = '' OR v.name LIKE %:#{#req.name}% OR v.code LIKE %:#{#req.name}%)
            AND (:#{#req.deleted} IS NULL OR v.deleted = :#{#req.deleted})
            AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
      
            """, nativeQuery = true)
    Page<VoucherResponse> getAllVoucher(@Param("req") VoucherRequest request, Pageable pageable);
    @Query("""
            SELECT a FROM Voucher a 
            WHERE (:#{#req.name} IS NULL 
            OR a.name LIKE %:#{#req.name}% OR a.code LIKE %:#{#req.name}%)
                        
            AND (:#{#req.deleted} IS NULL OR a.deleted = :#{#req.deleted})
            AND (:#{#req.status} IS NULL OR a.status = :#{#req.status})
            ORDER BY a.createAt DESC
            """)
    Page<Voucher> getAll(@Param("req") VoucherRequest request, Pageable pageable);
    Boolean existsByCode(String code);


    @Modifying
    @Query("UPDATE Voucher v SET v.quantity = v.quantity - 1 WHERE v.id = :id AND v.quantity > 0")
    int decreaseQuantityIfAvailable(@Param("id") Long id);



    @Query("SELECT v FROM Voucher v WHERE v.status <> :status")
    List<Voucher> findAllByStatusNot(@Param("status") Integer status);

}