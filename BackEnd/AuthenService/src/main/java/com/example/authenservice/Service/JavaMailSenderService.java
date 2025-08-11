package com.example.authenservice.Service;

import com.example.authenservice.Dtos.Request.NotificationForgotPassword;

public interface JavaMailSenderService {
    void javaSendMailForgotPassword(NotificationForgotPassword messageMail); // Thêm method mới

}
