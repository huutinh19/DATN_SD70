package com.poly.sport.controller.client;

import com.poly.sport.infrastructure.common.ResponseObject;
import com.poly.sport.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client/api/notification")
public class NotificationControllerClient {
    @Autowired
    private NotificationService notificationService;
    @GetMapping("/{id}")
    public ResponseObject getByAccount(@PathVariable(name = "id") Long id){
        return new ResponseObject(notificationService.getByAccount(id));
    }

    @PutMapping("/{id}")
    public ResponseObject updateType(@PathVariable Long id){
        return notificationService.updateType(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        notificationService.delete(id);
    }

    @DeleteMapping("/delete-all/{id}")
    public void deleteAll(@PathVariable Long id){
        notificationService.deleteAllByAccount(id);
    }
}
