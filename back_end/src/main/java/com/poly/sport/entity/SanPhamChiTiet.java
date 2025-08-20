package com.poly.sport.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.poly.sport.entity.base.PrimaryEnity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder

@Entity
@Table(name = "chi_tiet_san_pham")
public class SanPhamChiTiet extends PrimaryEnity {

    @Column(name = "code" , length = 50)
    private String code;
    @Column(name = "gia")
    private BigDecimal price;
    @Column(name = "so_luong")
    private Integer quantity;
    @Column(name = "can_nang")
    private Double weight;

    @ManyToOne
    @JoinColumn(name = "san_pham_id")
    @JsonIgnoreProperties(value = {"creatAt","updateAt","createBy","updateBy","deleted"})
    private SanPham shoe;

    @ManyToOne
    @JoinColumn(name = "kich_co_id")
    @JsonIgnoreProperties(value = {"creatAt","updateAt","createBy","updateBy","deleted"})
    private KichCo size;

    @ManyToOne
    @JoinColumn(name = "mau_sac_id")
    @JsonIgnoreProperties(value = {"creatAt","updateAt","createBy","updateBy","deleted"})
    private MauSac color;


}
