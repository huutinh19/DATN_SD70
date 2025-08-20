package com.poly.sport.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.poly.sport.entity.base.PrimaryEnity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "thong_bao")
public class Notification extends PrimaryEnity {
    @ManyToOne
    @JoinColumn(name = "account_id")
    @JsonIgnore
    private Account account;
    @Column(name = "type")
    private Integer type;
    @Nationalized
    @Column(name = "tieu_de")
    private String title;
    @Nationalized
    @Column(name = "noi_dung")
    private String content;
    @Nationalized
    @Column(name = "hoat_dong")
    private String action;

}
