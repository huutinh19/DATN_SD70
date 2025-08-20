package com.poly.sport.controller.admin;

import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    @GetMapping("/{id}")
    public ResponseObject getByAccount(@PathVariable Long id){
        return new ResponseObject(notificationService.getByAccount(id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        notificationService.delete(id);
    }

    @DeleteMapping("/delete-all/{id}")
    public void deleteAll(@PathVariable Long id){
        notificationService.deleteAllByAccount(id);
    }
    // Thêm endpoint PUT để cập nhật trạng thái thông báo
    @PutMapping("/{id}")
    public ResponseObject updateNotification(@PathVariable Long id) {
        return notificationService.updateType(id);
    }
}
