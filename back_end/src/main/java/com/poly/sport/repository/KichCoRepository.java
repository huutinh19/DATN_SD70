package com.poly.sport.repository;


import com.poly.sport.entity.KichCo;
import com.poly.sport.infrastructure.request.KichCoRequest;
import com.poly.sport.infrastructure.response.KichCoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KichCoRepository extends JpaRepository<KichCo, Long> {
    KichCo findByName(String name);
    Boolean existsByNameIgnoreCase(String name);

    @Query(value = """
            SELECT
            s.id AS id,
            s.name AS name,
            s.create_at AS createAt,
            ROW_NUMBER() OVER(ORDER BY s.create_at DESC) AS indexs,
            s.deleted AS status
            FROM kich_co s
            LEFT JOIN chi_tiet_san_pham sd ON s.id = sd.kich_co_id
            WHERE (:#{#req.name} IS NULL OR s.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR s.deleted = :#{#req.status})
            GROUP BY s.id
            """, nativeQuery = true)
    Page<KichCoResponse> getAllKichThuoc(@Param("req") KichCoRequest request, Pageable pageable);
}
