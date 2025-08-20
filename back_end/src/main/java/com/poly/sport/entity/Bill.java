package com.poly.sport.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.poly.sport.entity.base.PrimaryEnity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
@Entity
@Table(name = "hoa_don")

public class Bill extends PrimaryEnity {
    @ManyToOne
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;
    @ManyToOne
    @JoinColumn(name = "account_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted", "addresses", "password", "role"})
    private Account account;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted", "addresses", "password", "role"})
    private Account customer;
    @Column(name = "code")
    private String code;
    @Column(name = "type")
    private Integer type;
    @Nationalized
    @Column(name = "ten_khach_hang")
    private String customerName;
    @Column(name = "sdt", length = 20)
    private String phoneNumber;
    @Column(name = "email", length = 20)
    private String email;
    @Nationalized
    @Column(name = "dia_chi")
    private String address;
    @Column(name = "tien_ship")
    private BigDecimal moneyShip;
    @Column(name = "tien_giam")
    private BigDecimal moneyReduce;
    @Column(name = "tong_tien")
    private BigDecimal totalMoney;
    @Column(name = "ngay_thanh_toan")
    private Date payDate;
    @Column(name = "ngay_giao_hang")
    private Date shipDate;
    @Column(name = "ngay_du_kien")
    private Date desiredDate;
    @Column(name = "ngay_nhan")
    private Long receiveDate;
    @Column(name = "status")
    private Integer status;
    @Column(name = "ghi_chu")
    private String note;

}
