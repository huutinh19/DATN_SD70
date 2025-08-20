package com.poly.sport.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.poly.sport.entity.base.PrimaryEnity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter





@Entity
@Table(name = "gio_hang")
public class Cart  extends PrimaryEnity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private Account account;
}

