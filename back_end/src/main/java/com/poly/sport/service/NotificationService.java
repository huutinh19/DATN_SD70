package com.poly.sport.service;

import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.infrastructure.response.NotificationResponse;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getByAccount(Long idAccount);
    ResponseObject updateType(Long id);
    void delete(Long idNotification);
    void deleteAllByAccount(Long idAccount);
}
