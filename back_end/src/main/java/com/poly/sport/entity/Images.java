package com.poly.sport.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.poly.sport.entity.base.PrimaryEnity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

@Entity
@Table(name = "images")
public class Images extends PrimaryEnity {


    @ManyToOne
    @JoinColumn(name = "san_pham_id")
    @JsonIgnore
    private SanPham sanPham;
    @Nationalized
    @Column(name = "name")
    private String name;
}
