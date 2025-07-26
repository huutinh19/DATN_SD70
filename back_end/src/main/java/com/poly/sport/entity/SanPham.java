package com.poly.sport.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.poly.sport.entity.base.PrimaryEnity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Entity
@Table(name = "san_pham")
public class SanPham extends PrimaryEnity{

    @Column(name = "code" , length = 50)
    private String code;
    @Nationalized
    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "xuat_xu_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private XuatXu xuatXu;

    @ManyToOne
    @JoinColumn(name = "thuong_hieu_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private ThuongHieu thuongHieu;

    @ManyToOne
    @JoinColumn(name = "co_ao_id")
    @JsonIgnoreProperties(value = {"creatAt","updateAt","createBy","updateBy","deleted"})
    private CoAo coAo;

    @ManyToOne
    @JoinColumn(name = "tay_ao_id")
    @JsonIgnoreProperties(value = {"creatAt","updateAt","createBy","updateBy","deleted"})
    private TayAo tayAo;

    @ManyToOne
    @JoinColumn(name = "chat_lieu_id")
    @JsonIgnoreProperties(value = {"creatAt","updateAt","createBy","updateBy","deleted"})
    private ChatLieu chatLieu;

    @JsonIgnore
    @OneToMany(mappedBy = "shoe")
    List<SanPhamChiTiet> SanPhamChiTiet;


    @JsonIgnoreProperties(value = {"sanPham", "createAt", "updateAt", "createBy", "updateBy", "deleted"})
    @OneToMany(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private List<Images> images = new ArrayList<>(); // Khởi tạo danh sách mặc định

    @Column(name = "mo_ta")
    private String description;




}
