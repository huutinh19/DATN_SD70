package com.poly.sport.infrastructure.sercurity.auth;

import com.poly.sport.infrastructure.constant.AccountRoles;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SignUpRequets {

    @NotBlank(message = "Email trống")
    private String email;
    @NotBlank(message = "Name trống")
    private String name;
    @NotBlank(message = "Mật khẩu trống")
    @Pattern(regexp = "^(?=.*[0-9])(.{8,})$", message = "Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 số")
    private String password;

    private AccountRoles role;

    private String phoneNumber;
}
