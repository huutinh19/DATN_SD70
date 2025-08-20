////package com.poly.sport.service.impl;
////
////import com.poly.sport.entity.Images;
////import com.poly.sport.entity.SanPham;
////import com.poly.sport.infrastructure.common.PhanTrang;
////import com.poly.sport.infrastructure.converter.SanPhamConvert;
////import com.poly.sport.infrastructure.exception.NgoaiLe;
////import com.poly.sport.infrastructure.request.SanPhamRequest;
////import com.poly.sport.infrastructure.response.SanPhamKhuyenMaiRespone;
////import com.poly.sport.infrastructure.response.SanPhamResponse;
////import com.poly.sport.repository.*;
////import com.poly.sport.service.SanPhamService;
////import com.poly.sport.util.CloudinaryUtils;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.data.domain.PageRequest;
////import org.springframework.data.domain.Pageable;
////import org.springframework.stereotype.Service;
////import org.springframework.transaction.annotation.Transactional;
////import org.springframework.web.multipart.MultipartFile;
////
////import java.util.ArrayList;
////import java.util.Arrays;
////import java.util.Collections;
////import java.util.List;
////
////@Service
////public class SanPhamServiceImpl implements SanPhamService {
////    @Autowired
////    private SanPhamRepository sanPhamRepository;
////    @Autowired
////    private SanPhamConvert sanPhamConvert;
////
////    @Autowired
////    private AnhRepository anhRepository;
////
////    @Autowired
////    private DanhMucRepository danhMucRepository;
////
////    @Autowired
////    private ThuongHieuRepository thuongHieuRepository;
////
////    @Autowired
////    private DeRepository deRepository;
////    @Autowired
////    private CloudinaryUtils cloudinaryUtils;
////
////    @Autowired
////    private SanPhamChiTietRepository sanPhamChiTietRepository;
////    public PhanTrang<SanPhamResponse> getAll(SanPhamRequest request) {
////        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
////        return new PhanTrang<>(sanPhamRepository.getAllShoe(request, pageable));
////
////    }
////
////    public SanPham getOne(Long id){
////        return sanPhamRepository.findById(id).get();
////    }
////
//////    @Transactional
//////    public SanPham create(SanPhamRequest request) {
//////        if (sanPhamRepository.existsByNameIgnoreCase(request.getName())) {
//////            throw new NgoaiLe(request.getName() + " đã tồn tại");
//////        }
//////
//////        SanPham sanPham = sanPhamConvert.addconvertRequest(request);
//////        SanPham savedSanPham = sanPhamRepository.save(sanPham);
//////
//////        if (request.getListImages() != null && request.getListImages().size() > 3) {
//////            throw new NgoaiLe("Chỉ được thêm tối đa 3 hình ảnh!");
//////        }
//////
//////        List<Images> savedImages = new ArrayList<>(); // Danh sách để lưu các ảnh
//////        if (request.getListImages() != null && !request.getListImages().isEmpty()) {
//////            for (String imgUrl : request.getListImages()) {
//////                Images image = Images.builder()
//////                        .sanPham(savedSanPham)
//////                        .name(imgUrl)
//////                        .build();
//////                Images savedImage = anhRepository.save(image);
//////                savedImages.add(savedImage); // Thêm ảnh đã lưu vào danh sách
//////            }
//////            savedSanPham.setImages(savedImages); // Cập nhật danh sách images trong savedSanPham
//////        }
//////
//////        savedSanPham.getImages().size(); // Gọi để buộc tải hoặc xác nhận không null
//////        return savedSanPham;
//////    }
////
////
//////    public SanPham create(SanPhamRequest request) {
//////        if (sanPhamRepository.existsByNameIgnoreCase(request.getName())) {
//////            throw new NgoaiLe(request.getName() + " đã tồn tại");
//////        }
//////
//////        SanPham sanPham = sanPhamConvert.addconvertRequest(request);
//////
//////        // Save related entities if they don't exist
//////        if (sanPham.getCategory() != null && sanPham.getCategory().getId() == null) {
//////            danhMucRepository.save(sanPham.getCategory());
//////        }
//////        if (sanPham.getBrand() != null && sanPham.getBrand().getId() == null) {
//////            thuongHieuRepository.save(sanPham.getBrand());
//////        }
//////        if (sanPham.getSole() != null && sanPham.getSole().getId() == null) {
//////            deRepository.save(sanPham.getSole());
//////        }
//////
//////        // Save product first
//////        sanPham = sanPhamRepository.save(sanPham);
//////
//////        // Handle image uploads and URLs
//////        List<String> allImageUrls = new ArrayList<>();
//////
//////        // Xử lý ảnh upload
//////        if (request.getImages() != null && !request.getImages().isEmpty()) {
//////            if (request.getImages().size() + (request.getImageUrls() != null ? request.getImageUrls().size() : 0) > 3) {
//////                throw new NgoaiLe("Chỉ được thêm tối đa 3 hình ảnh!");
//////            }
//////            List<String> uploadedUrls = cloudinaryUtils.uploadMultipleImages(
//////                    request.getImages(),
//////                    "products/" + sanPham.getId()
//////            );
//////            allImageUrls.addAll(uploadedUrls);
//////        }
//////
//////        // Xử lý URL từ Cloudinary
//////        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
//////            if (request.getImageUrls().size() + (request.getImages() != null ? request.getImages().size() : 0) > 3) {
//////                throw new NgoaiLe("Chỉ được thêm tối đa 3 hình ảnh!");
//////            }
//////            allImageUrls.addAll(request.getImageUrls());
//////        }
//////
//////        // Save all image URLs to database
//////        for (String imageUrl : allImageUrls) {
//////            anhRepository.save(
//////                    Images.builder()
//////                            .sanPham(sanPham)
//////                            .name(imageUrl)
//////                            .build()
//////            );
//////        }
//////
//////        return sanPhamRepository.save(sanPham);
//////    }
////
////
////
////    public SanPham create(SanPhamRequest request) {
////        if (sanPhamRepository.existsByNameIgnoreCase(request.getName())) {
////            throw new NgoaiLe(request.getName() + " đã tồn tại");
////        }
////
////        SanPham sanPham = sanPhamConvert.addconvertRequest(request);
////
////        if (sanPham.getCategory() != null && sanPham.getCategory().getId() == null) {
////            danhMucRepository.save(sanPham.getCategory());
////        }
////        if (sanPham.getBrand() != null && sanPham.getBrand().getId() == null) {
////            thuongHieuRepository.save(sanPham.getBrand());
////        }
////        if (sanPham.getSole() != null && sanPham.getSole().getId() == null) {
////            deRepository.save(sanPham.getSole());
////        }
////
////        sanPham = sanPhamRepository.save(sanPham);
////
////        List<String> allImageUrls = new ArrayList<>();
////
////        if (request.getListImages() != null && !request.getListImages().isEmpty()) {
////            if (request.getListImages().size() > 3) {
////                throw new NgoaiLe("Chỉ được thêm tối đa 3 hình ảnh!");
////            }
////            allImageUrls.addAll(request.getListImages());
////        }
////
////        for (String listImages : allImageUrls) {
////            anhRepository.save(
////                    Images.builder()
////                            .sanPham(sanPham)
////                            .name(listImages)
////                            .build()
////            );
////        }
////
////        return sanPhamRepository.save(sanPham);
////    }
////
////
////
//////    public SanPham update(Long id, SanPhamRequest request) {
//////    SanPham name = sanPhamRepository.findById(id).get();
//////    if (sanPhamRepository.existsByNameIgnoreCase(request.getName())) {
//////        if (name.getName().equals(request.getName())) {
//////            return sanPhamRepository.save(sanPhamConvert.convertRequestToEntity(name, request));
//////        }
//////        throw new NgoaiLe(request.getName() + " đã tồn tại!");
//////    } else {
//////        return sanPhamRepository.save(sanPhamConvert.convertRequestToEntity(name, request));
//////    }
//////}
////
////    public SanPham update(Long id, SanPhamRequest request) {
////        SanPham existingSanPham = sanPhamRepository.findById(id)
////                .orElseThrow(() -> new NgoaiLe("Sản phẩm không tồn tại"));
////
////        // Kiểm tra tên trùng
////        if (sanPhamRepository.existsByNameIgnoreCase(request.getName()) &&
////                !existingSanPham.getName().equals(request.getName())) {
////            throw new NgoaiLe(request.getName() + " đã tồn tại!");
////        }
////
////        // Cập nhật thông tin cơ bản
////        SanPham updatedSanPham = sanPhamConvert.convertRequestToEntity(existingSanPham, request);
////
////        // Xử lý ảnh
////        if (request.getListImages() != null && !request.getListImages().isEmpty()) {
////            // Xóa ảnh cũ (tùy yêu cầu nghiệp vụ)
////            anhRepository.deleteBySanPhamId(id);
////
////            // Thêm ảnh mới
////            if (request.getListImages().size() > 3) {
////                throw new NgoaiLe("Chỉ được thêm tối đa 3 hình ảnh!");
////            }
////
////            for (String imageUrl : request.getListImages()) {
////                anhRepository.save(
////                        Images.builder()
////                                .sanPham(updatedSanPham)
////                                .name(imageUrl)
////                                .build()
////                );
////            }
////        }
////
////        // Lưu và trả về sản phẩm đã cập nhật
////        return sanPhamRepository.save(updatedSanPham);
////    }
////
////
////
////    //    public SanPham delete(Long id) {
//////        return null;
//////    }
////    public SanPham delete(Long id) {
////        SanPham sanPham = this.getOne(id);
////        sanPham.setDeleted(!sanPham.getDeleted());
////        return sanPhamRepository.save(sanPham);
////    }
////
////    public SanPham changeStatus(Long id) {
////        SanPham shoe = sanPhamRepository.findById(id).get();
////        shoe.setDeleted(shoe.getDeleted() == false ? true : false);
////        sanPhamRepository.save(shoe);
////        sanPhamChiTietRepository.findByShoe(shoe).forEach(shoeDetail -> {
////            shoeDetail.setDeleted(shoeDetail.getDeleted() == false ? true : false);
////            sanPhamChiTietRepository.save(shoeDetail);
////        });
////        return shoe;
////    }
////
////    public List<SanPhamKhuyenMaiRespone> getAllShoeInPromotion(Long promotion) {
////        return sanPhamRepository.getAllShoeInPromotion(promotion);
////    }
////
////
//////    public List<SanPhamResponse> getTopSell(Integer top) {
//////        return sanPhamRepository.topSell(top);
//////    }
////}
//
//package com.poly.sport.service.impl;
//
//import com.poly.sport.entity.Images;
//import com.poly.sport.entity.SanPham;
//import com.poly.sport.infrastructure.common.PhanTrang;
//import com.poly.sport.infrastructure.converter.SanPhamConvert;
//import com.poly.sport.infrastructure.exception.NgoaiLe;
//import com.poly.sport.infrastructure.request.FindSanPhamRequest;
//import com.poly.sport.infrastructure.request.SanPhamRequest;
//import com.poly.sport.infrastructure.response.SanPhamKhuyenMaiRespone;
//import com.poly.sport.infrastructure.response.SanPhamResponse;
//import com.poly.sport.repository.*;
//import com.poly.sport.service.SanPhamService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.List;
//
//@Service
//public class SanPhamServiceImpl implements SanPhamService {
//
//    @Autowired
//    private SanPhamRepository sanPhamRepository;
//
//    @Autowired
//    private SanPhamConvert sanPhamConvert;
//
//    @Autowired
//    private AnhRepository anhRepository;
//
//    @Autowired
//    private DanhMucRepository danhMucRepository;
//
//    @Autowired
//    private ThuongHieuRepository thuongHieuRepository;
//
//    @Autowired
//    private DeRepository deRepository;
//
//    @Autowired
//    private SanPhamChiTietRepository sanPhamChiTietRepository;
//
//    @Override
//    public PhanTrang<SanPhamResponse> getAll(FindSanPhamRequest request) {
//        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
//        FindSanPhamRequest customRequest = FindSanPhamRequest.builder()
//                .colors(request.getColor() != null ? Arrays.asList(request.getColor().split(",")) : null)
//                .sizes(request.getSize() != null ? Arrays.asList(request.getSize().split(",")) : null)
//                .soles(request.getSole() != null ? Arrays.asList(request.getSole().split(",")) : null)
//                .categories(request.getCategory() != null ? Arrays.asList(request.getCategory().split(",")) : null)
//                .brands(request.getBrand() != null ? Arrays.asList(request.getBrand().split(",")) : null)
//                .size(request.getSize())
//                .color(request.getColor())
//                .sole(request.getSole())
//                .name(request.getName())
//                .brand(request.getBrand())
//                .category(request.getCategory())
//                .minPrice(request.getMinPrice())
//                .maxPrice(request.getMaxPrice())
//                .category(request.getCategory())
//                .brand(request.getBrand())
//                .status(request.getStatus())
//                .build();
//
//
//        return new PhanTrang<>(sanPhamRepository.getAllShoe(customRequest, pageable));
//    }
//
//    private String genCode() {
//        String prefix = "SP";
//        int x = 0;
//        String code = prefix + String.format("%02d", x);
//        while (sanPhamRepository.existsByCode(code)) {
//            x++;
//            code = prefix + String.format("%02d", x);
//        }
//        return code;
//    }
//
//    // Phương thức kiểm tra và cập nhật trạng thái dựa trên số lượng
//    private SanPham updateStatusBasedOnQuantity(SanPham sanPham) {
//        long quantity = sanPhamChiTietRepository.findByShoe(sanPham)
//                .stream()
//                .mapToLong(detail -> detail.getQuantity() != null ? detail.getQuantity() : 0)
//                .sum();
//
//        // Nếu số lượng = 0 thì trạng thái deleted = false và không sửa được
//        if (quantity == 0) {
//            sanPham.setDeleted(true);
//        }
//        // Nếu số lượng > 0 thì trạng thái có thể được sửa (giữ nguyên giá trị hiện tại)
//        else {
//            // Không thay đổi trạng thái tự động, để thủ công qua changeStatus hoặc delete
//        }
//        return sanPhamRepository.save(sanPham);
//    }
//
////    @Override
////    public PhanTrang<SanPhamResponse> getAll(SanPhamRequest request) {
////        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
////        PhanTrang<SanPhamResponse> result = new PhanTrang<>(sanPhamRepository.getAllShoe(request, pageable));
////
////        result.getData().forEach(response -> {
////            SanPham sanPham = sanPhamRepository.findById(response.getId()).orElse(null);
////            if (sanPham != null) {
////                updateStatusBasedOnQuantity(sanPham);
////            }
////        });
////        return result;
////    }
//
//
//    @Override
//    public SanPham getOne(Long id) {
//        SanPham sanPham = sanPhamRepository.findById(id)
//                .orElseThrow(() -> new NgoaiLe("Sản phẩm không tồn tại"));
//        return updateStatusBasedOnQuantity(sanPham);
//    }
//
//    @Override
//    @Transactional
//    public SanPham create(SanPhamRequest request) {
//        if (sanPhamRepository.existsByNameIgnoreCase(request.getName())) {
//            throw new NgoaiLe(request.getName() + " đã tồn tại");
//        }
//
//        SanPham sanPham = sanPhamConvert.addconvertRequest(request);
//        sanPham.setCode(genCode());
//
//        if (sanPham.getCategory() != null && sanPham.getCategory().getId() == null) {
//            danhMucRepository.save(sanPham.getCategory());
//        }
//        if (sanPham.getBrand() != null && sanPham.getBrand().getId() == null) {
//            thuongHieuRepository.save(sanPham.getBrand());
//        }
//        if (sanPham.getSole() != null && sanPham.getSole().getId() == null) {
//            deRepository.save(sanPham.getSole());
//        }
//
//        sanPham = sanPhamRepository.save(sanPham);
//
//        List<String> allImageUrls = new ArrayList<>();
//        if (request.getListImages() != null && !request.getListImages().isEmpty()) {
//            if (request.getListImages().size() > 3) {
//                throw new NgoaiLe("Chỉ được thêm tối đa 3 hình ảnh!");
//            }
//            allImageUrls.addAll(request.getListImages());
//        }
//
//        for (String listImages : allImageUrls) {
//            anhRepository.save(
//                    Images.builder()
//                            .sanPham(sanPham)
//                            .name(listImages)
//                            .build()
//            );
//        }
//
//        return updateStatusBasedOnQuantity(sanPham);
//    }
//
//    @Override
//    @Transactional
//    public SanPham update(Long id, SanPhamRequest request) {
//        SanPham existingSanPham = sanPhamRepository.findById(id)
//                .orElseThrow(() -> new NgoaiLe("Sản phẩm không tồn tại"));
//
//        if (sanPhamRepository.existsByNameIgnoreCase(request.getName()) &&
//                !existingSanPham.getName().equals(request.getName())) {
//            throw new NgoaiLe(request.getName() + " đã tồn tại!");
//        }
//
//        SanPham updatedSanPham = sanPhamConvert.convertRequestToEntity(existingSanPham, request);
//
//        if (request.getListImages() != null && !request.getListImages().isEmpty()) {
//            anhRepository.deleteBySanPhamId(id);
//            if (request.getListImages().size() > 3) {
//                throw new NgoaiLe("Chỉ được thêm tối đa 3 hình ảnh!");
//            }
//            for (String imageUrl : request.getListImages()) {
//                anhRepository.save(
//                        Images.builder()
//                                .sanPham(updatedSanPham)
//                                .name(imageUrl)
//                                .build()
//                );
//            }
//        }
//
//        return updateStatusBasedOnQuantity(sanPhamRepository.save(updatedSanPham));
//    }
//
//    @Override
//    public SanPham delete(Long id) {
//        SanPham sanPham = this.getOne(id);
//        long quantity = sanPhamChiTietRepository.findByShoe(sanPham)
//                .stream()
//                .mapToLong(detail -> detail.getQuantity() != null ? detail.getQuantity() : 0)
//                .sum();
//
//        // Chỉ cho phép thay đổi trạng thái nếu quantity > 0
//        if (quantity > 0) {
//            sanPham.setDeleted(!sanPham.getDeleted());
//            return sanPhamRepository.save(sanPham);
//        } else {
//            throw new NgoaiLe("Không thể thay đổi trạng thái khi số lượng bằng 0!");
//        }
//    }
//
//    @Override
//    public SanPham changeStatus(Long id) {
//        SanPham sanPham = sanPhamRepository.findById(id)
//                .orElseThrow(() -> new NgoaiLe("Sản phẩm không tồn tại"));
//
//        long quantity = sanPhamChiTietRepository.findByShoe(sanPham)
//                .stream()
//                .mapToLong(detail -> detail.getQuantity() != null ? detail.getQuantity() : 0)
//                .sum();
//
//        // Chỉ cho phép thay đổi trạng thái nếu quantity > 0
//        if (quantity > 0) {
//            sanPham.setDeleted(!sanPham.getDeleted());
//            sanPhamChiTietRepository.findByShoe(sanPham).forEach(shoeDetail -> {
//                shoeDetail.setDeleted(sanPham.getDeleted());
//                sanPhamChiTietRepository.save(shoeDetail);
//            });
//            return sanPhamRepository.save(sanPham);
//        } else {
//            throw new NgoaiLe("Không thể thay đổi trạng thái khi số lượng bằng 0!");
//        }
//    }
//
//    @Override
//    public List<SanPhamKhuyenMaiRespone> getAllShoeInPromotion(Long promotion) {
//        return sanPhamRepository.getAllShoeInPromotion(promotion);
//    }
//    @Override
//    public List<SanPhamResponse> getTopSell(Integer top) {
//        return sanPhamRepository.topSell(top);
//    }
//}



package com.poly.sport.service.impl;

import com.poly.sport.entity.Images;
import com.poly.sport.entity.SanPham;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.converter.SanPhamConvert;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.FindSanPhamRequest;
import com.poly.sport.infrastructure.request.SanPhamRequest;
import com.poly.sport.infrastructure.response.SanPhamKhuyenMaiRespone;
import com.poly.sport.infrastructure.response.SanPhamResponse;
import com.poly.sport.repository.*;
import com.poly.sport.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class SanPhamServiceImpl implements SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private SanPhamConvert sanPhamConvert;

    @Autowired
    private AnhRepository anhRepository;



    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    @Autowired
    private XuatXuRepository xuatXuRepository;

    @Autowired
    private CoAoRepository coAoRepository;

    @Autowired
    private TayAoRepository tayAoRepository;

    @Autowired
    private ChatLieuRepository chatLieuRepository;


    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;

    @Override
    public PhanTrang<SanPhamResponse> getAll(FindSanPhamRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        FindSanPhamRequest customRequest = FindSanPhamRequest.builder()
//                .code(request.getCode())
                .name(request.getName())
                .xuatXu(request.getXuatXu())
                .thuongHieu(request.getThuongHieu())
                .coAo(request.getCoAo())
                .tayAo(request.getTayAo())
                .chatLieu(request.getChatLieu())
                .colors(request.getColor() != null ? Arrays.asList(request.getColor().split(",")) : null)
                .sizes(request.getSize() != null ? Arrays.asList(request.getSize().split(",")) : null)
                .xuatXus(request.getXuatXu() != null ? Arrays.asList(request.getXuatXu().split(",")) : null)
                .thuongHieus(request.getThuongHieu() != null ? Arrays.asList(request.getThuongHieu().split(",")) : null)
                .coAos(request.getCoAo() != null ? Arrays.asList(request.getCoAo().split(",")) : null)
                .tayAos(request.getTayAo() != null ? Arrays.asList(request.getTayAo().split(",")) : null)
                .chatLieus(request.getChatLieu() != null ? Arrays.asList(request.getChatLieu().split(",")) : null)
                .minPrice(request.getMinPrice())
                .maxPrice(request.getMaxPrice())
                .status(request.getStatus())


                .build();

        return new PhanTrang<>(sanPhamRepository.getAllShoe(customRequest, pageable));
    }

    private String genCode() {
        String prefix = "SP";
        int x = 0;
        String code = prefix + String.format("%02d", x);
        while (sanPhamRepository.existsByCode(code)) {
            x++;
            code = prefix + String.format("%02d", x);
        }
        return code;
    }

    @Override
    public SanPham getOne(Long id) {
        return sanPhamRepository.findById(id)
                .orElseThrow(() -> new NgoaiLe("Sản phẩm không tồn tại"));
    }

    @Override
    @Transactional
    public SanPham create(SanPhamRequest request) {
        if (sanPhamRepository.existsByNameIgnoreCase(request.getName())) {
            throw new NgoaiLe(request.getName() + " đã tồn tại");
        }

        SanPham sanPham = sanPhamConvert.addconvertRequest(request);
        sanPham.setCode(genCode());

        if (sanPham.getXuatXu() != null && sanPham.getXuatXu().getId() == null) {
            xuatXuRepository.save(sanPham.getXuatXu());
        }
        if (sanPham.getTayAo() != null && sanPham.getTayAo().getId() == null) {
            tayAoRepository.save(sanPham.getTayAo());
        }
        if (sanPham.getCoAo() != null && sanPham.getCoAo().getId() == null) {
            coAoRepository.save(sanPham.getCoAo());
        }
        if (sanPham.getThuongHieu() != null && sanPham.getThuongHieu().getId() == null) {
            thuongHieuRepository.save(sanPham.getThuongHieu());
        }
        if (sanPham.getChatLieu() != null && sanPham.getChatLieu().getId() == null) {
            chatLieuRepository.save(sanPham.getChatLieu());
        }


        sanPham = sanPhamRepository.save(sanPham);

        List<String> allImageUrls = new ArrayList<>();
        if (request.getListImages() != null && !request.getListImages().isEmpty()) {
            if (request.getListImages().size() > 5) {
                throw new NgoaiLe("Chỉ được thêm tối đa 5 hình ảnh!");
            }
            allImageUrls.addAll(request.getListImages());
        }

        for (String listImages : allImageUrls) {
            anhRepository.save(
                    Images.builder()
                            .sanPham(sanPham)
                            .name(listImages)
                            .build()
            );
        }

        return sanPham;
    }

    @Override
    @Transactional
    public SanPham update(Long id, SanPhamRequest request) {
        SanPham existingSanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new NgoaiLe("Sản phẩm không tồn tại"));

        if (sanPhamRepository.existsByNameIgnoreCase(request.getName()) &&
                !existingSanPham.getName().equals(request.getName())) {
            throw new NgoaiLe(request.getName() + " đã tồn tại!");
        }

        SanPham updatedSanPham = sanPhamConvert.convertRequestToEntity(existingSanPham, request);

        if (request.getListImages() != null && !request.getListImages().isEmpty()) {
            anhRepository.deleteBySanPhamId(id);
            if (request.getListImages().size() > 5) {
                throw new NgoaiLe("Chỉ được thêm tối đa 5 hình ảnh!");
            }
            for (String imageUrl : request.getListImages()) {
                anhRepository.save(
                        Images.builder()
                                .sanPham(updatedSanPham)
                                .name(imageUrl)
                                .build()
                );
            }
        }

        return sanPhamRepository.save(updatedSanPham);
    }

    @Override
    public SanPham delete(Long id) {
        SanPham sanPham = this.getOne(id);
        long quantity = sanPhamChiTietRepository.findByShoe(sanPham)
                .stream()
                .mapToLong(detail -> detail.getQuantity() != null ? detail.getQuantity() : 0)
                .sum();

        if (quantity > 0) {
            sanPham.setDeleted(!sanPham.getDeleted());
            return sanPhamRepository.save(sanPham);
        } else {
            throw new NgoaiLe("Không thể thay đổi trạng thái khi số lượng bằng 0!");
        }
    }

    @Override
        public SanPham changeStatus(Long id) {
        SanPham shoe = sanPhamRepository.findById(id).get();
        shoe.setDeleted(shoe.getDeleted() == false ? true : false);
        sanPhamRepository.save(shoe);
        sanPhamChiTietRepository.findByShoe(shoe).forEach(shoeDetail -> {
            shoeDetail.setDeleted(shoeDetail.getDeleted() == false ? true : false);
            sanPhamChiTietRepository.save(shoeDetail);
        });
        return shoe;
    }

    @Override
    public List<SanPhamKhuyenMaiRespone> getAllShoeInPromotion(Long promotion) {
        return sanPhamRepository.getAllShoeInPromotion(promotion);
    }

    @Override
    public List<SanPhamResponse> getTopSell(Integer top) {
        return sanPhamRepository.topSell(top);
    }


    @Override
    public List<SanPhamResponse> getTopSellWithDateFilter(Integer top, LocalDateTime startDate, LocalDateTime endDate) {
        return sanPhamRepository.topSellWithDateFilter(top, startDate, endDate);
    }
}