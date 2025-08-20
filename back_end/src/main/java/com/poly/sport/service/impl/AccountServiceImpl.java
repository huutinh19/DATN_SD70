//package com.poly.sport.service.impl;
//
//import com.poly.sport.entity.Account;
//import com.poly.sport.entity.Address;
//import com.poly.sport.infrastructure.common.GenCode;
//import com.poly.sport.infrastructure.common.PhanTrang;
////import com.poly.sport.infrastructure.constant.AccountRoles;
//import com.poly.sport.infrastructure.constant.AccountRoles;
//import com.poly.sport.infrastructure.converter.AccountConvert;
//import com.poly.sport.infrastructure.converter.AddressConvert;
//import com.poly.sport.infrastructure.exception.NgoaiLe;
//import com.poly.sport.infrastructure.request.AccountRequest;
//import com.poly.sport.infrastructure.response.AccountResponse;
//import com.poly.sport.repository.*;
//import com.poly.sport.service.*;
//import com.poly.sport.util.CloudinaryUtils;
//import com.poly.sport.util.MailUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//public class AccountServiceImpl implements AccountService {
//    private final PasswordEncoder passwordEncoder;
//
//    @Autowired
//    private AccountRepository accountRepository;
//    @Autowired
//    private RoleRepository roleRepository;
//    @Autowired
//    private AddressRepository addressRepository;
//    @Autowired
//    private AccountConvert accountConvert;
//    @Autowired
//    private AddressConvert addressConvert;
//    @Autowired
//    private MailUtils mailUtils;
//    @Autowired
//    private CloudinaryUtils cloudinaryUtils;
//
//    public AccountServiceImpl(PasswordEncoder passwordEncoder) {
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public PhanTrang<AccountResponse> getAll(AccountRequest request) {
//        Pageable pageable = PageRequest.of(request.getPage()-1, request.getSizePage());
//        return new PhanTrang<>(accountRepository.getAll(request, pageable));
//    }
//
//    @Override
//    public Account getOne(Long id, String roleName) {
//        return accountRepository.getOne(id, roleName);
//    }
//
////    @Override
////    @Transactional
////    public Account create(AccountRequest request, String roleName) {
////        if (accountRepository.existsByUsernameAndUsernameNot(request.getUsername(), ""))
////            throw new NgoaiLe("Username đã tồn tại!");
////        if (accountRepository.existsByEmailAndEmailNot(request.getEmail(), ""))
////            throw new NgoaiLe("Email đã tồn tại!");
////        if (accountRepository.existsByPhoneNumberAndPhoneNumberNot(request.getPhoneNumber(), ""))
////            throw new NgoaiLe("SDT đã tồn tại!");
//////        if (accountRepository.existsByCccdAndCccdNot(request.getCccd(), ""))
//////            throw new NgoaiLe("Mã định danh đã tồn tại!");
////
////        String randomPassword = GenCode.randomPassword();
////        Account account = accountConvert.convertRequestToEntity(request);
////        account.setRole(roleRepository.findByName(roleName));
////        account.setAccountRoles(roleName.equals("Khách hàng") ? AccountRoles.ROLE_USER : AccountRoles.ROLE_EMLOYEE);
////        account.setPassword(passwordEncoder.encode(randomPassword)); // Mã hóa mật khẩu để lưu vào database
////        account.setAvatar("defaultAvatar.jpg");
////        Account accountSave = accountRepository.save(account);
////        if (accountSave != null) {
////            Address address = addressConvert.convertRequestToEntity(request.getAddress());
////            address.setAccount(accountSave);
////            addressRepository.save(address);
//////            Upload Images
////            if (request.getAvatar() != null)
////                accountSave.setAvatar(String.valueOf(cloudinaryUtils.uploadSingleImage(request.getAvatar(), "account")));
//////            Send Mail
////            String emailContent = "Chào " + accountSave.getEmail() + "\n" +
////                    "Bạn vừa dùng email này để đăng ký tài khoản\n" +
////                    "Tài khoản của bạn là: " + accountSave.getUsername() + "\n" +
////                    "Mật khẩu đăng nhập là: " + randomPassword + "\n\n" + // Sửa ở đây
////                    "Đây là email tự động, vui lòng không reply email này.\nCảm ơn.\n\n";
////            mailUtils.sendEmail(accountSave.getEmail(), "Thư xác thực tài khoản", emailContent);
////        }
////        return accountSave;
////    }
//
//    @Override
//    @Transactional
//    public Account create(AccountRequest request, String roleName) {
//        if (accountRepository.existsByUsernameAndUsernameNot(request.getUsername(), ""))
//            throw new NgoaiLe("Username đã tồn tại!");
//        if (accountRepository.existsByEmailAndEmailNot(request.getEmail(), ""))
//            throw new NgoaiLe("Email đã tồn tại!");
//        if (accountRepository.existsByPhoneNumberAndPhoneNumberNot(request.getPhoneNumber(), ""))
//            throw new NgoaiLe("SDT đã tồn tại!");
//
//        String randomPassword = GenCode.randomPassword();
//        Account account = accountConvert.convertRequestToEntity(request);
//        account.setRole(roleRepository.findByName(roleName));
//        account.setAccountRoles(roleName.equals("Khách hàng") ? AccountRoles.ROLE_USER : AccountRoles.ROLE_EMLOYEE);
//        account.setPassword(passwordEncoder.encode(randomPassword)); // Mã hóa mật khẩu để lưu vào database
//        account.setAvatar("defaultAvatar.jpg");
//
//        Account accountSave = accountRepository.save(account);
//        if (accountSave != null) {
//            // Tạo địa chỉ mới và đặt DefaultAddress = true
//            Address address = addressConvert.convertRequestToEntity(request.getAddress());
//            address.setAccount(accountSave);
//            address.setDefaultAddress(true);
//
//            // Kiểm tra xem có địa chỉ nào mặc định trước đó không, nếu có thì cập nhật nó thành false
//            Address oldDefaultAddress = addressRepository.findByAccountIdAndDefaultAddress(accountSave.getId(), true);
//            if (oldDefaultAddress != null) {
//                oldDefaultAddress.setDefaultAddress(false);
//                addressRepository.save(oldDefaultAddress);
//            }
//
//            addressRepository.save(address);
//
//            // Upload Avatar nếu có
//            if (request.getAvatar() != null)
//                accountSave.setAvatar(String.valueOf(cloudinaryUtils.uploadSingleImage(request.getAvatar(), "account")));
//
//            // Gửi Email xác nhận
//            String emailContent = "Chào " + accountSave.getEmail() + "\n" +
//                    "Bạn vừa dùng email này để đăng ký tài khoản\n" +
//                    "Tài khoản của bạn là: " + accountSave.getUsername() + "\n" +
//                    "Mật khẩu đăng nhập là: " + randomPassword + "\n\n" +
//                    "Đây là email tự động, vui lòng không reply email này.\nCảm ơn.\n\n";
//            mailUtils.sendEmail(accountSave.getEmail(), "Thư xác thực tài khoản", emailContent);
//        }
//        return accountSave;
//    }
//
//
//    @Override
//    public Account update(Long id, AccountRequest request) {
//        Account old = accountRepository.findById(id).get();
//        if (accountRepository.existsByUsernameAndUsernameNot(request.getUsername(), old.getUsername()))
//            throw new NgoaiLe("Username đã tồn tại!");
//        if (accountRepository.existsByEmailAndEmailNot(request.getEmail(), old.getEmail()))
//            throw new NgoaiLe("Email đã tồn tại!");
//        if (accountRepository.existsByPhoneNumberAndPhoneNumberNot(request.getPhoneNumber(), old.getPhoneNumber()))
//            throw new NgoaiLe("SDT đã tồn tại!");
////        if (accountRepository.existsByCccdAndCccdNot(request.getCccd(), old.getCccd()))
////            throw new NgoaiLe("Mã định danh đã tồn tại!");
//        Account accountSave = accountRepository.save(accountConvert.convertRequestToEntity(id, request));
//        if (accountSave != null) {
//            if (request.getAvatar() != null) {
//                accountSave.setAvatar(String.valueOf(cloudinaryUtils.uploadSingleImage(request.getAvatar(), "account")));
//                accountRepository.save(accountSave);
//            }
//        }
//        return accountSave;
//    }
//
//    @Override
//    public Account delete(Long id) {
//        return null;
//    }
//}



package com.poly.sport.service.impl;

import com.poly.sport.entity.Account;
import com.poly.sport.entity.Address;
import com.poly.sport.infrastructure.common.GenCode;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.constant.AccountRoles;
import com.poly.sport.infrastructure.converter.AccountConvert;
import com.poly.sport.infrastructure.converter.AddressConvert;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.AccountRequest;
import com.poly.sport.infrastructure.response.AccountResponse;
import com.poly.sport.repository.*;
import com.poly.sport.service.*;
import com.poly.sport.util.CloudinaryUtils;
import com.poly.sport.util.MailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountServiceImpl implements AccountService {
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private AccountConvert accountConvert;
    @Autowired
    private AddressConvert addressConvert;
    @Autowired
    private MailUtils mailUtils;
    @Autowired
    private CloudinaryUtils cloudinaryUtils;

    public AccountServiceImpl(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public PhanTrang<AccountResponse> getAll(AccountRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PhanTrang<>(accountRepository.getAll(request, pageable));
    }

    @Override
    public Account getOne(Long id, String roleName) {
        return accountRepository.getOne(id, roleName);
    }

    @Override
    @Transactional
    public Account create(AccountRequest request, String roleName) {
        if (accountRepository.existsByUsernameAndUsernameNot(request.getUsername(), ""))
            throw new NgoaiLe("Username đã tồn tại!");
        if (accountRepository.existsByEmailAndEmailNot(request.getEmail(), ""))
            throw new NgoaiLe("Email đã tồn tại!");
        if (accountRepository.existsByPhoneNumberAndPhoneNumberNot(request.getPhoneNumber(), ""))
            throw new NgoaiLe("SDT đã tồn tại!");

        String randomPassword = GenCode.randomPassword();
        Account account = accountConvert.convertRequestToEntity(request);
        account.setRole(roleRepository.findByName(roleName));
        account.setAccountRoles(roleName.equals("Khách hàng") ? AccountRoles.ROLE_USER : AccountRoles.ROLE_EMLOYEE);
        account.setPassword(passwordEncoder.encode(randomPassword));
        account.setAvatar("defaultAvatar.jpg");

        Account accountSave = accountRepository.save(account);
        if (accountSave != null) {
            Address address = addressConvert.convertRequestToEntity(request.getAddress());
            address.setAccount(accountSave);
            address.setDefaultAddress(true);

            Address oldDefaultAddress = addressRepository.findByAccountIdAndDefaultAddress(accountSave.getId(), true);
            if (oldDefaultAddress != null) {
                oldDefaultAddress.setDefaultAddress(false);
                addressRepository.save(oldDefaultAddress);
            }

            addressRepository.save(address);

            if (request.getAvatar() != null)
                accountSave.setAvatar(String.valueOf(cloudinaryUtils.uploadSingleImage(request.getAvatar(), "account")));

            String emailContent = "Chào " + accountSave.getEmail() + "\n" +
                    "Bạn vừa dùng email này để đăng ký tài khoản\n" +
                    "Tài khoản của bạn là: " + accountSave.getUsername() + "\n" +
                    "Mật khẩu đăng nhập là: " + randomPassword + "\n\n" +
                    "Đây là email tự động, vui lòng không reply email này.\nCảm ơn.\n\n";
            mailUtils.sendEmail(accountSave.getEmail(), "Thư xác thực tài khoản", emailContent);
        }
        return accountSave;
    }

    @Override
    public Account update(Long id, AccountRequest request) {
        Account old = accountRepository.findById(id).orElseThrow(() -> new NgoaiLe("Tài khoản không tồn tại!"));
        if (accountRepository.existsByUsernameAndUsernameNot(request.getUsername(), old.getUsername()))
            throw new NgoaiLe("Username đã tồn tại!");
        if (accountRepository.existsByEmailAndEmailNot(request.getEmail(), old.getEmail()))
            throw new NgoaiLe("Email đã tồn tại!");
        if (accountRepository.existsByPhoneNumberAndPhoneNumberNot(request.getPhoneNumber(), old.getPhoneNumber()))
            throw new NgoaiLe("SDT đã tồn tại!");

        Account accountSave = accountConvert.convertRequestToEntity(id, request);
        if (request.getAvatar() != null) {
            accountSave.setAvatar(String.valueOf(cloudinaryUtils.uploadSingleImage(request.getAvatar(), "account")));
        }
        return accountRepository.save(accountSave);
    }

    @Override
    @Transactional
    public Account delete(Long id) {
        Account account = accountRepository.findById(id).orElseThrow(() -> new NgoaiLe("Tài khoản không tồn tại!"));
        account.setDeleted(!account.getDeleted());
        return accountRepository.save(account);
    }
}