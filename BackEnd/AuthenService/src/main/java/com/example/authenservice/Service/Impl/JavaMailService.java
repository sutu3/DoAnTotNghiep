package com.example.authenservice.Service.Impl;

import com.example.authenservice.Dtos.Request.NotificationForgotPassword;
import com.example.authenservice.Service.JavaMailSenderService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class JavaMailService implements JavaMailSenderService {
    String MAIL_HOST="minhdaimk111@gmail.com";
    JavaMailSender javaMailSender;
    SpringTemplateEngine templateEngine;

    @Override
    public void javaSendMailForgotPassword(NotificationForgotPassword messageMail) {
        System.out.println("🚀 Sending forgot password email to: " + messageMail.getTo());
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());

            Context context = new Context();
            context.setVariable("name", messageMail.getToName());
            context.setVariable("resetLink", messageMail.getResetLink());
            context.setVariable("userId", messageMail.getUserId());
            String html = templateEngine.process("forgotpassword", context);

            helper.setTo(messageMail.getTo());
            helper.setText(html, true);
            helper.setSubject("Đặt lại mật khẩu - Warehouse Management System");
            helper.setFrom(MAIL_HOST);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            log.error("❌ Failed to send forgot password email", e);
        }
    }
}
