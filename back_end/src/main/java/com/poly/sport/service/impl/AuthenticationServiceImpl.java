package com.poly.sport.service.impl;

import com.poly.sport.entity.Account;
import com.poly.sport.infrastructure.constant.AccountRoles;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.ChangePassword;
import com.poly.sport.infrastructure.request.ResetPassword;
import com.poly.sport.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.poly.sport.infrastructure.sercurity.auth.SignUpRequets;
import com.poly.sport.infrastructure.sercurity.auth.SigninRequest;
import com.poly.sport.infrastructure.sercurity.token.JwtSerrvice;
import com.poly.sport.repository.AccountRepository;
import com.poly.sport.repository.RoleRepository;
import com.poly.sport.service.AuthenticationService;
import com.poly.sport.util.MailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtSerrvice jwtSerrvice;

    private final RoleRepository roleRepository;
    @Autowired
    private MailUtils mailUtils;

    @Override
    public String signUp(SignUpRequets signUpRequets) {

        Optional<Account> optional = accountRepository.findByEmail(signUpRequets.getEmail());
        if(optional.isPresent()){
            throw new NgoaiLe("Email không tồn tại");
        }
        if (accountRepository.existsByPhoneNumberAndPhoneNumberNot(signUpRequets.getPhoneNumber(), "")) {
            throw new NgoaiLe("Số điện thoại đã tồn tại!");
        }
        Account account = new Account();
        account.setEmail(signUpRequets.getEmail());
        account.setPhoneNumber(signUpRequets.getPhoneNumber());
        account.setAccountRoles(signUpRequets.getRole());
        account.setName(signUpRequets.getName());
        account.setPassword(passwordEncoder.encode(signUpRequets.getPassword()));
        if(signUpRequets.getRole().equals(AccountRoles.ROLE_USER)){
            account.setRole(roleRepository.findByName("Khách hàng"));
        }
        accountRepository.save(account);

        String emailContent = "Chào " + signUpRequets.getEmail() + "\n" + "Bạn vừa dùng email này để đăng ký tài khoản cho hệ thống T&T Sport\n" + "Tài khoản của bạn là: " + signUpRequets.getEmail() + "\n" + "Mật khẩu đăng nhập là: " + signUpRequets.getPassword() + "\n\n" + "Đây là email tự động, vui lòng không reply email này.\nCảm ơn.\n\n";
        mailUtils.sendEmail(signUpRequets.getEmail(), "Thư xác thực tài khoản", emailContent);

        return "Người dùng đã được thêm vào hệ thống";
    }

    @Override
    public JwtAuhenticationResponse singIn(SigninRequest request) {
        Account check = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NgoaiLe("Tài khoản hoặc mật khẩu không chính xác!"));


        if (check.getDeleted()) {
            throw new NgoaiLe("Tài khoản đã bị vô hiệu hóa!");
        }

        if (!passwordEncoder.matches(request.getPassword(), check.getPassword())) {
            throw new NgoaiLe("Tài khoản hoặc mật khẩu không chính xác!");
        }

        var jwt = jwtSerrvice.genetateToken(check);
        var refreshToken = jwtSerrvice.genetateRefreshToken(new HashMap<>(), check);
        return JwtAuhenticationResponse.builder()
                .refreshToken(refreshToken)
                .token(jwt)
                .build();
    }

    @Override
    public String resetPassword(ResetPassword resetPassword) {
        Optional<Account> optional = accountRepository.findByEmail(resetPassword.getEmailForgot());
        if (!optional.isPresent()) {
            throw new NgoaiLe("Không tìm thấy tài khoản.");
        }


        if (optional.get().getDeleted()) {
            throw new NgoaiLe("Tài khoản đã bị vô hiệu hóa, không thể đặt lại mật khẩu!");
        }

        Random rnd = new Random();
        String password = String.valueOf(rnd.nextInt(999999));
        optional.get().setPassword(passwordEncoder.encode(password));
        accountRepository.save(optional.get());
        String emailContent = "Chào " + optional.get().getEmail() + "\n" +
                "Mật khẩu mới cho hệ thống T&T Sport\n" +
                "Tài khoản của bạn là: " + optional.get().getEmail() + "\n" +
                "Mật khẩu đăng nhập là: " + password + "\n\n" +
                "Đây là email tự động, vui lòng không reply email này.\nCảm ơn.\n\n";
        mailUtils.sendEmail(optional.get().getEmail(), "Thư xác thực tài khoản", emailContent);
        return "Thành công.";
    }

    @Override
    public String changePassword(ChangePassword changePassword) {
        var optional = accountRepository.findByEmail(changePassword.getEmail());
        if (!optional.isPresent()) {
            throw new NgoaiLe("Không tìm thấy tài khoản.");
        }
        if (passwordEncoder.matches(changePassword.getPassword(), optional.get().getPassword())) {
            String newPasswordEncoded = passwordEncoder.encode(changePassword.getNewPassword());
            optional.get().setPassword(newPasswordEncoded);
            accountRepository.save(optional.get());
        } else {
            throw new NgoaiLe("Mật khẩu hiện tại không đúng");
        }
        return "Đổi mật khẩu thành công";
    }


}
