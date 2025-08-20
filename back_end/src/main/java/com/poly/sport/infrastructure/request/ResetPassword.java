package com.poly.sport.infrastructure.request;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResetPassword {

    private  String emailForgot ;

    private String phoneNumber;
}

