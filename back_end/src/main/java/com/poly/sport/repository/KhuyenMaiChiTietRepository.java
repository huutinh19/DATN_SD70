package com.poly.sport.repository;

import com.poly.sport.entity.KhuyenMaiChiTiet;
import com.poly.sport.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhuyenMaiChiTietRepository extends JpaRepository<KhuyenMaiChiTiet, Long> {
    Boolean existsByShoeDetailId(Long id);

    @Query(value = """
            SELECT GROUP_CONCAT(DISTINCT s.id) FROM khuyen_mai_chi_tiet pmd
            JOIN chi_tiet_san_pham sd ON sd.id = pmd.chi_tiet_san_pham_id
            JOIN san_pham s ON s.id = sd.san_pham_id
            JOIN khuyen_mai pm ON pm.id = pmd.khuyen_mai_id
            WHERE :idPromotion IS NULL OR pm.id = :idPromotion
            """, nativeQuery = true)
    List<String> getListIdShoePromotion(@Param("idPromotion") Long idPromotion);

    KhuyenMaiChiTiet findByShoeDetailId(Long id);

    @Query(value = """
            SELECT pmd.chi_tiet_san_pham_id FROM khuyen_mai_chi_tiet pmd
            WHERE :idPromotion IS NULL OR pmd.khuyen_mai_id = :idPromotion
            """, nativeQuery = true)
    List<String> getListIdShoeDetailInPromotion(@Param("idPromotion") Long idPromotion);

    KhuyenMaiChiTiet findByShoeDetailCode(String code);

    @Query("SELECT pd.id FROM KhuyenMaiChiTiet pd WHERE pd.promotion.id = :promotionId")
    List<Long> findIdsByPromotionId(@Param("promotionId") Long promotionId);

    Boolean existsByShoeDetail(SanPhamChiTiet shoeDetail);



    // Sửa lại phương thức kiểm tra SPCT có đang áp dụng promotion đang hoạt động không
    @Query("SELECT CASE WHEN COUNT(pd) > 0 THEN true ELSE false END " +
            "FROM KhuyenMaiChiTiet pd " +
            "JOIN pd.promotion p " +
            "WHERE pd.shoeDetail.id = :shoeDetailId " +
            "AND p.status IN (0, 1)")// 0: Chưa bắt đầu, 1: Đang diễn ra
    Boolean existsByShoeDetailIdAndActivePromotion(@Param("shoeDetailId") Long shoeDetailId);



//    // Thêm phương thức lấy tất cả SPCT đang áp dụng promotion
//    @Query("SELECT DISTINCT pd.shoeDetail.id FROM KhuyenMaiChiTiet pd " +
//            "JOIN pd.promotion p " +
//            "WHERE p.status IN (0, 1)") // Chỉ lấy các SPCT trong promotion chưa bắt đầu hoặc đang diễn ra
//    List<Long> findAllUsedShoeDetailIds();

    // Trong KhuyenMaiChiTietRepository
    @Query("SELECT DISTINCT pd.shoeDetail.id FROM KhuyenMaiChiTiet pd " +
            "JOIN pd.promotion p " +
            "WHERE p.status = 1") // Chỉ lấy các SPCT trong promotion đang diễn ra
    List<Long> findAllActiveShoeDetailIds();

    @Query("SELECT pd FROM KhuyenMaiChiTiet pd WHERE pd.shoeDetail.id = :shoeDetailId")
    List<KhuyenMaiChiTiet> findByShoeDetailId1(@Param("shoeDetailId") Long shoeDetailId);
}