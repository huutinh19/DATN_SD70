package com.poly.sport.service;

import com.poly.sport.infrastructure.request.ChangePassword;
import com.poly.sport.infrastructure.request.ResetPassword;
import com.poly.sport.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.poly.sport.infrastructure.sercurity.auth.SignUpRequets;
import com.poly.sport.infrastructure.sercurity.auth.SigninRequest;

public interface AuthenticationService {
    String signUp(SignUpRequets signUpRequets);

    JwtAuhenticationResponse singIn(SigninRequest request);

    String resetPassword(ResetPassword resetPassword);

    String changePassword (ChangePassword changePassword);
}
