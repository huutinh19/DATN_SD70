package com.poly.sport.infrastructure.response;

import com.poly.sport.entity.Account;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;
import java.util.Date;

@Projection(types = {Account.class})
public interface AccountResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Long getId();
    String getName();
    String getEmail();
    String getPhoneNumber();
    LocalDateTime getCreateAt();
    Date getBirthday();
    String getGender();
    Boolean getStatus();

}