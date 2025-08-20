package com.poly.sport.repository;

import com.poly.sport.entity.Notification;
import com.poly.sport.infrastructure.response.NotificationResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface INotificationRepository extends JpaRepository<Notification, Long> {
    @Query(value = """
            SELECT ROW_NUMBER() OVER(ORDER BY n.create_at DESC) AS indexs,
            n.id AS id,
            n.tieu_de AS title,
            n.noi_dung AS content,
            n.hoat_dong AS action,
            n.create_at AS createAt,
            n.type AS type
            FROM thong_bao n
            WHERE n.account_id = :idAccount
            """, nativeQuery = true)
    List<NotificationResponse> getByAccount(@Param("idAccount") Long id);

    List<Notification> findByAccountId(Long id);
}
