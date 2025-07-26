package com.poly.sport.entity;

import com.poly.sport.entity.base.PrimaryEnity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "phuong_thuc_thanh_toan")
public class PaymentMethod extends PrimaryEnity {
    @ManyToOne
    @JoinColumn(name = "hoa_don_id")
    private Bill bill;
    @Column(name = "phuong_thuc_thanh_toan")
    private Integer method;
    @Column(name = "tong_tien")
    private BigDecimal totalMoney;
    @Nationalized
    @Column(name = "ghi_chu")
    private String note;
    @Nationalized
    @Column(name = "ma_giao_dich")
    private String tradingCode;


    private Boolean type;
}
