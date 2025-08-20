package com.poly.sport.repository;

import com.poly.sport.entity.ChatLieu;
import com.poly.sport.infrastructure.request.ChatLieuRequest;
import com.poly.sport.infrastructure.response.ChatLieuResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatLieuRepository extends JpaRepository<ChatLieu,Long> {
    Boolean existsByNameIgnoreCase(String name);

    @Query(value = """
            SELECT
            s.id AS id,
            s.name AS name,
            s.create_at AS createAt,
            ROW_NUMBER() OVER(ORDER BY s.create_at DESC) AS indexs,
            s.deleted AS status
            FROM chat_lieu s
            LEFT JOIN chi_tiet_san_pham sd ON s.id = sd.kich_co_id
            WHERE (:#{#req.name} IS NULL OR s.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR s.deleted = :#{#req.status})
            GROUP BY s.id
            """, nativeQuery = true)
    Page<ChatLieuResponse> getAllChatLieu(@Param("req") ChatLieuRequest request, Pageable pageable);
}
