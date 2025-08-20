package com.poly.sport.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.poly.sport.entity.base.PrimaryEnity;
import com.poly.sport.infrastructure.constant.AccountRoles;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString

@Entity
@Table(name = "account")
public class Account extends PrimaryEnity implements UserDetails {
    @Column(name = "username")
    private String username;
    @Column(name = "cccd")
    private String cccd;
    @Nationalized
    @Column(name = "name")
    private String name;
    @Column(name = "so_dien_thoai")
    private String phoneNumber;
    @Column(name = "email")
    private String email;
    @Nationalized
    @Column(name = "password")
    private String password;
    @Nationalized
    @Column(name = "avatar")
    private String avatar;
    @Column(name = "ngay_sinh")
    @Temporal(TemporalType.DATE)
    private Date birthday;
    @Nationalized
    @Column(name = "gioi_tinh")
    private String gender;
    @ManyToOne
    @JoinColumn(name = "role_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private Role role;


    @Enumerated(EnumType.STRING)
    private AccountRoles accountRoles;

    @JsonIgnoreProperties(value = {"shoeDetail", "createAt", "updateAt", "createBy", "updateBy", "deleted"})
    @OneToMany(mappedBy = "account", fetch = FetchType.EAGER)
    List<Address> addresses;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(accountRoles.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }


}
