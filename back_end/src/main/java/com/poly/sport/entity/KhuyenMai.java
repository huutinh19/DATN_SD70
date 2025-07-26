package com.poly.sport.entity;


import com.poly.sport.entity.base.PrimaryEnity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "khuyen_mai")
public class KhuyenMai extends PrimaryEnity {

    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "gia_tri")
    private Float value;

    @Column(name = "start_date")
    private LocalDateTime startDate;
    @Column(name = "end_date")
    private LocalDateTime endDate;
    @Column(name = "status")
    private Integer status;
}
