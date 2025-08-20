package com.poly.sport.infrastructure.sercurity.auth;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SigninRequest {

    private String email;

    private String password;
}
