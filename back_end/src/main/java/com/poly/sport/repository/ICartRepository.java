package com.poly.sport.repository;

import com.poly.sport.entity.Cart;
import com.poly.sport.infrastructure.response.CartResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICartRepository extends JpaRepository<Cart, Long> {
    @Query(value = """
            SELECT
                cd.id AS id,
                ROW_NUMBER() OVER(ORDER BY cd.update_at DESC) AS indexs,
                CONCAT(s.name, ' [', c.name, ' - ', sz.name, ']') AS name,
                sd.id AS idProductDetail,
                cd.so_luong AS quantity,
                s.deleted AS status,
                sd.gia AS price,
                (SELECT GROUP_CONCAT(img.name SEPARATOR ',')
                 FROM images img
                 WHERE img.san_pham_id = s.id) AS image,
                MAX(CASE
                        WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date
                            THEN pmd.gia_khuyen_mai
                        ELSE NULL
                    END) AS discountValue,
                MAX(CASE
                        WHEN pm.status = 1 AND CURRENT_TIMESTAMP BETWEEN pm.start_date AND pm.end_date
                            THEN pm.gia_tri
                        ELSE NULL
                    END) AS discountPercent
            FROM gio_hang_chi_tiet cd
            LEFT JOIN gio_hang ct ON cd.gio_hang_id = ct.id
            LEFT JOIN chi_tiet_san_pham sd ON sd.id = cd.chi_tiet_san_pham_id
            LEFT JOIN mau_sac c ON c.id = sd.mau_sac_id
            LEFT JOIN kich_co sz ON sz.id = sd.kich_co_id
            LEFT JOIN san_pham s ON sd.san_pham_id = s.id
            LEFT JOIN khuyen_mai_chi_tiet pmd ON pmd.chi_tiet_san_pham_id = sd.id
            LEFT JOIN khuyen_mai pm ON pm.id = pmd.khuyen_mai_id
            WHERE ct.account_id = :idAccount AND s.deleted = FALSE 
            GROUP BY s.id, cd.id
        """, nativeQuery = true)
    List<CartResponse> getListCart(@Param("idAccount") Long idAccount);

    Cart findByAccountId(Long idAccount);
}