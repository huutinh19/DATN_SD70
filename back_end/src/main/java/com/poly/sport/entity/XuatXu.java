package com.poly.sport.entity;

import com.poly.sport.entity.base.PrimaryEnity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.Nationalized;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "xuat_xu")
public class XuatXu extends PrimaryEnity {
    @Nationalized
    @Column(name = "name")
    @NotNull(message = "Tên không được bỏ trống")
    private String name;
}
