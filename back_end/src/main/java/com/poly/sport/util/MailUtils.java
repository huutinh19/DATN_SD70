package com.poly.sport.util;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


import java.util.concurrent.CompletableFuture;

@Service
public class MailUtils {
    @Autowired
    private JavaMailSender javaMailSender;

    @Async
    public CompletableFuture<String> sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // true để bật HTML

            javaMailSender.send(message);
            return CompletableFuture.completedFuture("Gửi mail thành công!");
        } catch (Exception e) {
            return CompletableFuture.completedFuture("Gửi mail thất bại: " + e.getMessage());
        }
    }
}