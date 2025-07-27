package com.poly.tool;//package com.poly.tool;
//
//import com.poly.sport.entity.Account;
//import com.poly.sport.entity.Role;
//import com.poly.sport.infrastructure.constant.AccountRoles;
//import com.poly.sport.repository.AccountRepository;
//import com.poly.sport.repository.RoleRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.ConfigurableApplicationContext;
//import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//import java.util.Date;
//
//@SpringBootApplication
//@EnableJpaRepositories(basePackages = "com.poly.sport.repository")
//public class DBGenerator implements CommandLineRunner {
//
//    @Autowired
//    private AccountRepository accountRepository;
//
//    @Autowired
//    private RoleRepository roleRepository;
//
//    @Override
//    public void run(String... args) throws Exception {
//        // Create Role: Nhân viên
//        Role nhanVien = new Role();
//        nhanVien.setName("Nhân viên");
//        nhanVien.setId(roleRepository.save(nhanVien).getId());
//
//        // Create Role: Khách hàng
//        Role khachHang = new Role();
//        khachHang.setName("Khách hàng");
//        khachHang.setId(roleRepository.save(khachHang).getId());
//
//        // Create Role: Admin
//        Role admin = new Role();
//        admin.setName("Admin");
//        admin.setId(roleRepository.save(admin).getId());
//
//        // Admin Account
//        Account admin1 = new Account();
//        admin1.setName("Nguyễn Văn Admin");
//        admin1.setBirthday(new Date(95, 5, 20));
//        admin1.setCccd("123456789012");
//        admin1.setEmail("admin@fpt.edu.vn");
//        admin1.setAccountRoles(AccountRoles.ROLE_ADMIN);
//        admin1.setGender("Nam");
//        admin1.setPassword(new BCryptPasswordEncoder().encode("123456789"));
//        admin1.setPhoneNumber("0987654321");
//        admin1.setUsername("admin01");
//        admin1.setRole(admin);
//        admin1.setId(accountRepository.save(admin1).getId());
//
//        // Employee 1
//        Account nhanVien1 = new Account();
//        nhanVien1.setName("Lưu Văn Nam");
//        nhanVien1.setBirthday(new Date(99, 3, 16));
//        nhanVien1.setCccd("535834053750");
//        nhanVien1.setEmail("nam@fpt.edu.vn");
//        nhanVien1.setAccountRoles(AccountRoles.ROLE_EMLOYEE);
//        nhanVien1.setGender("Nam");
//        nhanVien1.setPassword(new BCryptPasswordEncoder().encode("123456789"));
//        nhanVien1.setPhoneNumber("0335867600");
//        nhanVien1.setUsername("nam123");
//        nhanVien1.setRole(nhanVien);
//        nhanVien1.setId(accountRepository.save(nhanVien1).getId());
//
//        // Employee 2
//        Account nhanVien2 = new Account();
//        nhanVien2.setName("Trần Thị Mai");
//        nhanVien2.setBirthday(new Date(97, 8, 12));
//        nhanVien2.setCccd("987654321098");
//        nhanVien2.setEmail("mai@fpt.edu.vn");
//        nhanVien2.setAccountRoles(AccountRoles.ROLE_EMLOYEE);
//        nhanVien2.setGender("Nữ");
//        nhanVien2.setPassword(new BCryptPasswordEncoder().encode("123456789"));
//        nhanVien2.setPhoneNumber("0912345678");
//        nhanVien2.setUsername("mai456");
//        nhanVien2.setRole(nhanVien);
//        nhanVien2.setId(accountRepository.save(nhanVien2).getId());
//
//        // Customer 1
//        Account khachHang1 = new Account();
//        khachHang1.setName("Phạm Văn Hùng");
//        khachHang1.setBirthday(new Date(98, 1, 25));
//        khachHang1.setCccd("456789123456");
//        khachHang1.setEmail("hung@gmail.com");
//        khachHang1.setAccountRoles(AccountRoles.ROLE_USER);
//        khachHang1.setGender("Nam");
//        khachHang1.setPassword(new BCryptPasswordEncoder().encode("123456789"));
//        khachHang1.setPhoneNumber("0935123456");
//        khachHang1.setUsername("hung789");
//        khachHang1.setRole(khachHang);
//        khachHang1.setId(accountRepository.save(khachHang1).getId());
//
//        // Customer 2
//        Account khachHang2 = new Account();
//        khachHang2.setName("Nguyễn Thị Lan");
//        khachHang2.setBirthday(new Date(96, 11, 30));
//        khachHang2.setCccd("789123456789");
//        khachHang2.setEmail("lan@gmail.com");
//        khachHang2.setAccountRoles(AccountRoles.ROLE_USER);
//        khachHang2.setGender("Nữ");
//        khachHang2.setPassword(new BCryptPasswordEncoder().encode("123456789"));
//        khachHang2.setPhoneNumber("0978123456");
//        khachHang2.setUsername("lan101");
//        khachHang2.setRole(khachHang);
//        khachHang2.setId(accountRepository.save(khachHang2).getId());
//    }
//    public static void main(String[] args) {
//        ConfigurableApplicationContext ctx = SpringApplication.run(DBGenerator.class);
//        ctx.close();
//    }
//
//}
