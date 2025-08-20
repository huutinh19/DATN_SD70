package com.poly.sport.controller.client;


import com.poly.sport.infrastructure.request.ImageGalleryRequest;
import com.poly.sport.util.CloudinaryUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/client/api/image-gallery")
public class ImageGalleryControllerClient {
    @Autowired
    private CloudinaryUtils cloudinaryUtils;

    @GetMapping("/{folderName}")
    public List<Map> getImagesInFolder(@PathVariable String folderName,
                                       @RequestParam(required = false, defaultValue = "50") Integer size) {
        return cloudinaryUtils.getImagesInFolder(folderName, size);
    }

    @PostMapping
    public String uploadImage(@ModelAttribute ImageGalleryRequest request) {
        List<String> url = cloudinaryUtils.uploadMultipleImages(request.getImages(), request.getFolder());
        if (url.isEmpty())
            return "Thất bại!";
        else
            return "Thêm thành công!";
    }


}
