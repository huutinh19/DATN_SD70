


package com.poly.sport.repository;

import com.poly.sport.entity.SanPham;
import com.poly.sport.entity.SanPhamChiTiet;
import com.poly.sport.infrastructure.request.FindShoeDetailRequest;
import com.poly.sport.infrastructure.response.SanPhamChiTietReponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface SanPhamChiTietRepository extends JpaRepository<SanPhamChiTiet, Long> {
    Boolean existsByCodeAndCodeNot(String code, String exceptCode);
    Boolean existsByCode(String code);

    SanPhamChiTiet findByCode(String code);
    List<SanPhamChiTiet> findByShoe(SanPham shoe);

    @Query(value = """
    SELECT
        sd.id AS id,
        ROW_NUMBER() OVER(ORDER BY s.update_at DESC) AS indexs,
        CONCAT(s.name) AS name,
        sd.code AS code,
        c.name AS color,
        sz.name AS size,
        sd.so_luong AS quantity,
        sd.can_nang AS weight,
        sd.gia AS price,
        CASE
            WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date
                THEN pmd.gia_khuyen_mai
            ELSE NULL
        END AS discountValue,
        CASE
            WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date
                THEN MAX(pm.gia_tri)
            ELSE NULL
        END AS discountPercent,
        GROUP_CONCAT(DISTINCT img.name ORDER BY img.create_at ASC) AS images,
        sd.deleted AS status
    FROM chi_tiet_san_pham sd
    LEFT JOIN san_pham s ON sd.san_pham_id = s.id
    LEFT JOIN mau_sac c ON sd.mau_sac_id = c.id
    LEFT JOIN kich_co sz ON sd.kich_co_id = sz.id
    LEFT JOIN images img ON img.san_pham_id = s.id
    LEFT JOIN khuyen_mai_chi_tiet pmd ON pmd.chi_tiet_san_pham_id = sd.id
    LEFT JOIN khuyen_mai pm ON pm.id = pmd.khuyen_mai_id
    WHERE
        (:#{#req.shoe} IS NULL OR sd.san_pham_id IN (:#{#req.shoes}))
        AND (:#{#req.color} IS NULL OR :#{#req.color} = '' OR sd.mau_sac_id IN (:#{#req.colors}))
        AND (:#{#req.size} IS NULL OR :#{#req.size} = '' OR sd.kich_co_id IN (:#{#req.sizes}))
        AND (:#{#req.name} IS NULL OR :#{#req.name} = '' OR s.name LIKE %:#{#req.name}%)
    GROUP BY
        sd.id, s.update_at, s.name, c.name, sz.name, sd.code, sd.so_luong, sd.can_nang, sd.gia, sd.deleted, pm.start_date, pm.end_date, pm.status, pmd.gia_khuyen_mai
""", nativeQuery = true)
    Page<SanPhamChiTietReponse> getAll(@Param("req") FindShoeDetailRequest request, Pageable pageable);

    @Query(value = """
    SELECT
        sd.id AS id,
        ROW_NUMBER() OVER (
            ORDER BY
                CASE
                    WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date THEN 0
                    ELSE 1
                END ASC,
                s.update_at DESC
        ) AS indexs,
        CONCAT(s.name) AS name,
        sd.code AS code,
        c.name AS color,
        sz.name AS size,
        sd.so_luong AS quantity,
        sd.can_nang AS weight,
        sd.gia AS price,
        xx.name AS xuatXu,
        br.name AS thuongHieu,
        ca.name AS coAo,
        ta.name AS tayAo,
        cl.name AS chatLieu,
        
        CASE
            WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date
                THEN pmd.gia_khuyen_mai
            ELSE NULL
        END AS discountValue,
        CASE
            WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date
                THEN MAX(pm.gia_tri)
            ELSE NULL
        END AS discountPercent,
        GROUP_CONCAT(DISTINCT img.name ORDER BY img.create_at ASC) AS images,
        sd.deleted AS status
    FROM chi_tiet_san_pham sd
    LEFT JOIN san_pham s ON sd.san_pham_id = s.id
    LEFT JOIN mau_sac c ON sd.mau_sac_id = c.id
    LEFT JOIN kich_co sz ON sd.kich_co_id = sz.id
      LEFT JOIN xuat_xu xx ON xx.id = s.xuat_xu_id
    LEFT JOIN thuong_hieu br ON br.id = s.thuong_hieu_id
    LEFT JOIN co_ao ca ON ca.id = s.co_ao_id
    LEFT JOIN tay_ao ta ON ta.id = s.tay_ao_id
    LEFT JOIN chat_lieu cl ON cl.id = s.chat_lieu_id
    LEFT JOIN images img ON img.san_pham_id = s.id
    LEFT JOIN khuyen_mai_chi_tiet pmd ON pmd.chi_tiet_san_pham_id = sd.id
    LEFT JOIN khuyen_mai pm ON pm.id = pmd.khuyen_mai_id
    WHERE
        s.deleted = false
        AND sd.deleted = false
        AND (:#{#req.shoe} IS NULL OR sd.san_pham_id IN (:#{#req.shoes}))
        AND (:#{#req.color} IS NULL OR :#{#req.color} = '' OR sd.mau_sac_id IN (:#{#req.colors}))
        AND (:#{#req.size} IS NULL OR :#{#req.size} = '' OR sd.kich_co_id IN (:#{#req.sizes}))
        AND (:#{#req.xuatXu} IS NULL OR :#{#req.xuatXu} = '' OR s.xuat_xu_id IN (:#{#req.xuatXus}))
        AND (:#{#req.thuongHieu} IS NULL OR :#{#req.thuongHieu} = '' OR s.thuong_hieu_id IN (:#{#req.thuongHieus}))
        AND (:#{#req.coAo} IS NULL OR :#{#req.coAo} = '' OR s.co_ao_id IN (:#{#req.coAos}))
        AND (:#{#req.tayAo} IS NULL OR :#{#req.tayAo} = '' OR s.tay_ao_id IN (:#{#req.tayAos}))
        AND (:#{#req.chatLieu} IS NULL OR :#{#req.chatLieu} = '' OR s.chat_lieu_id IN (:#{#req.chatLieus}))
        AND (:#{#req.name} IS NULL OR :#{#req.name} = '' OR s.name LIKE %:#{#req.name}%)
    GROUP BY
        sd.id, s.update_at, s.name, c.name, sz.name, xx.name, br.name, ca.name, ta.name, cl.name, sd.code, sd.so_luong, sd.can_nang, sd.gia, sd.deleted, pm.start_date, pm.end_date, pm.status, pmd.gia_khuyen_mai
    ORDER BY
        CASE
            WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date THEN 0
            ELSE 1
        END ASC,
        s.update_at DESC
""", nativeQuery = true)
    Page<SanPhamChiTietReponse> getAllBillDetail(@Param("req") FindShoeDetailRequest request, Pageable pageable);

    @Query(value = """
    SELECT
        sd.id AS id,
        ROW_NUMBER() OVER(ORDER BY s.update_at DESC) AS indexs,
        CONCAT(s.name, ' [', c.name, ' - ', sz.name, ']') AS name,
        sd.code AS code,
        c.name AS color,
        sz.name AS size,
        sd.so_luong AS quantity,
        sd.can_nang AS weight,
        sd.gia AS price,
        CASE
            WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date
                THEN pmd.gia_khuyen_mai
            ELSE NULL
        END AS discountValue,
        CASE
            WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date
                THEN MAX(pm.gia_tri)
            ELSE NULL
        END AS discountPercent,
        GROUP_CONCAT(DISTINCT img.name ORDER BY img.create_at ASC) AS images,
        sd.deleted AS status
    FROM chi_tiet_san_pham sd
    LEFT JOIN san_pham s ON sd.san_pham_id = s.id
    LEFT JOIN mau_sac c ON sd.mau_sac_id = c.id
    LEFT JOIN kich_co sz ON sd.kich_co_id = sz.id
    LEFT JOIN images img ON img.san_pham_id = s.id
    LEFT JOIN khuyen_mai_chi_tiet pmd ON pmd.chi_tiet_san_pham_id = sd.id
    LEFT JOIN khuyen_mai pm ON pm.id = pmd.khuyen_mai_id
    WHERE sd.id = :id
    GROUP BY
        sd.id, s.update_at, s.name, c.name, sz.name, sd.code, sd.so_luong, sd.can_nang, sd.gia, sd.deleted, pm.start_date, pm.end_date, pm.status, pmd.gia_khuyen_mai
""", nativeQuery = true)
    SanPhamChiTietReponse getOneShoeDetail(@Param("id") Long id);

    SanPhamChiTiet findByShoeIdAndColorIdAndSizeId(Long idShoe, Long idColor, Long idSize);

    SanPhamChiTiet findByShoeIdAndColorNameAndSizeName(Long idShoe, String colorName, String sizeName);

    @Query("SELECT MIN(sd.price) AS minPrice, MAX(sd.price) AS maxPrice FROM SanPhamChiTiet sd")
    Map<String, BigDecimal> findMinAndMaxPrice();
}