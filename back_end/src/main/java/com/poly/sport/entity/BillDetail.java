package com.poly.sport.entity;

import com.poly.sport.entity.base.PrimaryEnity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

@Entity
@Table(name = "hoa_don_chi_tiet")
public class BillDetail extends PrimaryEnity {
    @ManyToOne
    @JoinColumn(name = "chi_tiet_san_pham_id")
    private SanPhamChiTiet shoeDetail;
    @ManyToOne
    @JoinColumn(name = "hoa_don_id")
    private Bill bill;
    @Column(name = "gia")
    private BigDecimal price;
    @Column(name = "so_luong")
    private Integer quantity;
    @Column(name = "status")
    private Boolean status;
    @Column(name = "phan_tram_giam")
    private Float discountPercent; // Discount percentage at the time of adding (nullable)

    @Column(name = "gia_tri_giam")
    private BigDecimal discountValue;
}
