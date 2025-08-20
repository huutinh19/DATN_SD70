package com.poly.sport.repository;

import com.poly.sport.entity.SanPham;
import com.poly.sport.infrastructure.request.FindSanPhamRequest;
import com.poly.sport.infrastructure.response.SanPhamKhuyenMaiRespone;
import com.poly.sport.infrastructure.response.SanPhamResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Long> {
    Boolean existsByNameIgnoreCase(String name);




    @Query(value = """
SELECT
    s.id AS id,
    s.code AS code,
    s.name AS name,
    ROW_NUMBER() OVER (ORDER BY s.create_at DESC) AS indexs,
    GROUP_CONCAT(DISTINCT c.name) AS color,
    GROUP_CONCAT(DISTINCT sz.name) AS size,
    (SELECT GROUP_CONCAT(DISTINCT img.name ORDER BY img.create_at ASC)
     FROM images img
     WHERE img.san_pham_id = s.id) AS images,
    s.mo_ta AS description,
    COALESCE(SUM(sd.so_luong), 0) AS quantity,
    xx.name AS xuatXu,
    br.name AS thuongHieu,
    ca.name AS coAo,
    ta.name AS tayAo,
    cl.name AS chatLieu,
    MAX(sd.gia) AS maxPrice,
    MIN(sd.gia) AS minPrice,
    MAX(CASE
        WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date
            THEN pmd.gia_khuyen_mai
        ELSE NULL
    END) AS discountValue,
    MAX(CASE
        WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date
            THEN pm.gia_tri
        ELSE NULL
    END) AS discountPercent,
    s.deleted AS status
FROM san_pham s
LEFT JOIN chi_tiet_san_pham sd ON s.id = sd.san_pham_id
LEFT JOIN mau_sac c ON c.id = sd.mau_sac_id
LEFT JOIN kich_co sz ON sz.id = sd.kich_co_id
LEFT JOIN xuat_xu xx ON xx.id = s.xuat_xu_id
LEFT JOIN thuong_hieu br ON br.id = s.thuong_hieu_id
LEFT JOIN co_ao ca ON ca.id = s.co_ao_id
LEFT JOIN tay_ao ta ON ta.id = s.tay_ao_id
LEFT JOIN chat_lieu cl ON cl.id = s.chat_lieu_id
LEFT JOIN khuyen_mai_chi_tiet pmd ON pmd.chi_tiet_san_pham_id = sd.id
LEFT JOIN khuyen_mai pm ON pm.id = pmd.khuyen_mai_id
WHERE (:#{#req.name} IS NULL OR s.name LIKE CONCAT('%', :#{#req.name}, '%'))
    AND (:#{#req.xuatXu} IS NULL OR :#{#req.xuatXu} = '' OR s.xuat_xu_id IN (:#{#req.xuatXus}))
    AND (:#{#req.thuongHieu} IS NULL OR :#{#req.thuongHieu} = '' OR s.thuong_hieu_id IN (:#{#req.thuongHieus}))
    AND (:#{#req.coAo} IS NULL OR :#{#req.coAo} = '' OR s.co_ao_id IN (:#{#req.coAos}))
    AND (:#{#req.tayAo} IS NULL OR :#{#req.tayAo} = '' OR s.tay_ao_id IN (:#{#req.tayAos}))
    AND (:#{#req.chatLieu} IS NULL OR :#{#req.chatLieu} = '' OR s.chat_lieu_id IN (:#{#req.chatLieus}))
    AND (:#{#req.colors} IS NULL OR :#{#req.colors} = '' OR sd.mau_sac_id IN (:#{#req.colors}))
    AND (:#{#req.sizes} IS NULL OR :#{#req.sizes} = '' OR sd.kich_co_id IN (:#{#req.sizes}))
    AND (:#{#req.status} IS NULL OR s.deleted = :#{#req.status})
GROUP BY s.id, s.code, s.name, s.mo_ta, xx.name, br.name, ca.name, ta.name, cl.name, s.deleted
HAVING (:#{#req.minPrice} IS NULL OR :#{#req.maxPrice} IS NULL OR (MIN(sd.gia) BETWEEN :#{#req.minPrice} AND :#{#req.maxPrice}))
ORDER BY s.create_at DESC
""",
            countQuery = """
SELECT COUNT(DISTINCT s.id)
FROM san_pham s
LEFT JOIN chi_tiet_san_pham sd ON s.id = sd.san_pham_id
LEFT JOIN mau_sac c ON c.id = sd.mau_sac_id
LEFT JOIN kich_co sz ON sz.id = sd.kich_co_id
LEFT JOIN xuat_xu xx ON xx.id = s.xuat_xu_id
LEFT JOIN thuong_hieu br ON br.id = s.thuong_hieu_id
LEFT JOIN co_ao ca ON ca.id = s.co_ao_id
LEFT JOIN tay_ao ta ON ta.id = s.tay_ao_id
LEFT JOIN chat_lieu cl ON cl.id = s.chat_lieu_id
WHERE (:#{#req.name} IS NULL OR s.name LIKE CONCAT('%', :#{#req.name}, '%'))

    AND (:#{#req.xuatXu} IS NULL OR :#{#req.xuatXu} = '' OR s.xuat_xu_id IN (:#{#req.xuatXus}))
    AND (:#{#req.thuongHieu} IS NULL OR :#{#req.thuongHieu} = '' OR s.thuong_hieu_id IN (:#{#req.thuongHieus}))
    AND (:#{#req.coAo} IS NULL OR :#{#req.coAo} = '' OR s.co_ao_id IN (:#{#req.coAos}))
    AND (:#{#req.tayAo} IS NULL OR :#{#req.tayAo} = '' OR s.tay_ao_id IN (:#{#req.tayAos}))
    AND (:#{#req.chatLieu} IS NULL OR :#{#req.chatLieu} = '' OR s.chat_lieu_id IN (:#{#req.chatLieus}))
    AND (:#{#req.colors} IS NULL OR :#{#req.colors} = '' OR sd.mau_sac_id IN (:#{#req.colors}))
    AND (:#{#req.sizes} IS NULL OR :#{#req.sizes} = '' OR sd.kich_co_id IN (:#{#req.sizes}))
    AND (:#{#req.status} IS NULL OR s.deleted = :#{#req.status})
""", nativeQuery = true)
    Page<SanPhamResponse> getAllShoe(@Param("req") FindSanPhamRequest request, Pageable pageable);

    @Query(value = """
    SELECT
        s.id AS id,
        s.code AS code,
        s.name AS name,
        ROW_NUMBER() OVER(ORDER BY s.create_at DESC) AS indexs,
        xx.name AS xuatXu,
        br.name AS thuongHieu,
        ca.name AS coAo,
        ta.name AS tayAo,
        cl.name AS chatLieu,
        pm.id AS discount
    FROM san_pham s
    LEFT JOIN chi_tiet_san_pham sd ON s.id = sd.san_pham_id
    LEFT JOIN xuat_xu xx ON xx.id = s.xuat_xu_id
    LEFT JOIN thuong_hieu br ON br.id = s.thuong_hieu_id
    LEFT JOIN co_ao ca ON ca.id = s.co_ao_id
    LEFT JOIN tay_ao ta ON ta.id = s.tay_ao_id
    LEFT JOIN chat_lieu cl ON cl.id = s.chat_lieu_id
    LEFT JOIN khuyen_mai_chi_tiet pmd ON pmd.chi_tiet_san_pham_id = sd.id
    LEFT JOIN khuyen_mai pm ON pm.id = pmd.khuyen_mai_id
    WHERE (:promotion IS NULL OR pm.id = :promotion)
    """, nativeQuery = true)
    List<SanPhamKhuyenMaiRespone> getAllShoeInPromotion(@Param("promotion") Long promotion);

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
        xx.name AS xuatXu,
        br.name AS thuongHieu,
        ca.name AS coAo,
        ta.name AS tayAo,
        cl.name AS chatLieu,
        MAX(sd.gia) AS maxPrice,
        MIN(sd.gia) AS minPrice,
        SUM(bd.so_luong) AS quantitySold,
        s.deleted AS status
    FROM san_pham s
    LEFT JOIN chi_tiet_san_pham sd ON s.id = sd.san_pham_id
    LEFT JOIN mau_sac c ON c.id = sd.mau_sac_id
    LEFT JOIN kich_co sz ON sz.id = sd.kich_co_id
    LEFT JOIN xuat_xu xx ON xx.id = s.xuat_xu_id
    LEFT JOIN thuong_hieu br ON br.id = s.thuong_hieu_id
    LEFT JOIN co_ao ca ON ca.id = s.co_ao_id
    LEFT JOIN tay_ao ta ON ta.id = s.tay_ao_id
    LEFT JOIN chat_lieu cl ON cl.id = s.chat_lieu_id
    LEFT JOIN hoa_don_chi_tiet bd ON bd.chi_tiet_san_pham_id = sd.id
    LEFT JOIN hoa_don b ON b.id = bd.hoa_don_id
    WHERE s.deleted = FALSE AND b.status = 6
    GROUP BY s.id, s.code, s.name, xx.name, br.name, ca.name, ta.name, cl.name, s.deleted
    ORDER BY SUM(bd.so_luong) DESC
    LIMIT :top
    """, nativeQuery = true)
    List<SanPhamResponse> topSell(@Param("top") Integer top);

    Boolean existsByCode(String code);

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
        xx.name AS xuatXu,
        br.name AS thuongHieu,
        ca.name AS coAo,
        ta.name AS tayAo,
        cl.name AS chatLieu,
        MAX(sd.gia) AS maxPrice,
        MIN(sd.gia) AS minPrice,
        SUM(bd.so_luong) AS quantitySold,
        s.deleted AS status
    FROM san_pham s
    LEFT JOIN chi_tiet_san_pham sd ON s.id = sd.san_pham_id
    LEFT JOIN mau_sac c ON c.id = sd.mau_sac_id
    LEFT JOIN kich_co sz ON sz.id = sd.kich_co_id
    LEFT JOIN xuat_xu xx ON xx.id = s.xuat_xu_id
    LEFT JOIN thuong_hieu br ON br.id = s.thuong_hieu_id
    LEFT JOIN co_ao ca ON ca.id = s.co_ao_id
    LEFT JOIN tay_ao ta ON ta.id = s.tay_ao_id
    LEFT JOIN chat_lieu cl ON cl.id = s.chat_lieu_id
    LEFT JOIN hoa_don_chi_tiet bd ON bd.chi_tiet_san_pham_id = sd.id
    LEFT JOIN hoa_don b ON b.id = bd.hoa_don_id
    WHERE s.deleted = FALSE AND b.status = 6
    AND (:startDate IS NULL OR :endDate IS NULL OR b.update_at BETWEEN :startDate AND :endDate)
    GROUP BY s.id, s.code, s.name, xx.name, br.name, ca.name, ta.name, cl.name, s.deleted
    ORDER BY SUM(bd.so_luong) DESC
    LIMIT :top
    """, nativeQuery = true)
    List<SanPhamResponse> topSellWithDateFilter(
            @Param("top") Integer top,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
