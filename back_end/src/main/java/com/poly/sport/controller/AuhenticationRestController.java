package com.poly.sport.controller;


import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.exception.CustomListValidationException;
import com.poly.sport.infrastructure.request.ChangePassword;
import com.poly.sport.infrastructure.request.ResetPassword;
import com.poly.sport.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.poly.sport.infrastructure.sercurity.auth.SignUpRequets;
import com.poly.sport.infrastructure.sercurity.auth.SigninRequest;
import com.poly.sport.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login-v2")
//@CrossOrigin("*")
@RequiredArgsConstructor
public class AuhenticationRestController {

    private final AuthenticationService authenticationService;

    @PostMapping("/singup")
    public String singup(@Valid @RequestBody SignUpRequets requets, BindingResult bindingResult) throws CustomListValidationException {
        if (bindingResult.hasErrors()) {
            throw new CustomListValidationException(404, bindingResult.getAllErrors());
        }
        return authenticationService.signUp(requets);
    }

        @PostMapping("/singin")
    public ResponseEntity<JwtAuhenticationResponse> singin(@RequestBody SigninRequest requets) {
        return ResponseEntity.ok(authenticationService.singIn(requets));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword (@RequestBody ResetPassword resetPassword){
        return ResponseEntity.ok(authenticationService.resetPassword(resetPassword));
    }

    @PostMapping("/change-password")
    public ResponseObject changePassword (@RequestBody ChangePassword changePassword){
        return new ResponseObject(authenticationService.changePassword(changePassword));
    }


}
