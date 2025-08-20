package com.poly.sport.infrastructure.converter;


import com.poly.sport.entity.SanPham;
import com.poly.sport.infrastructure.request.SanPhamRequest;
import com.poly.sport.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SanPhamConvert {
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


        public SanPham addconvertRequest(SanPhamRequest request){
                SanPham sanPham = SanPham.builder()
                        .name(request.getName())
                        .thuongHieu(thuongHieuRepository.findById(request.getThuongHieu()).get())
                        .xuatXu(xuatXuRepository.findById(request.getXuatXu()).get())
                        .tayAo(tayAoRepository.findById(request.getTayAo()).get())
                        .coAo(coAoRepository.findById(request.getCoAo()).get())
                        .chatLieu(chatLieuRepository.findById(request.getChatLieu()).get())
                        .description(request.getDescription())
                        .build();
                return sanPham;
        }
        public SanPham convertRequestToEntity(SanPham sanPham, SanPhamRequest request){
                sanPham.setName(request.getName());
                sanPham.setXuatXu(xuatXuRepository.findById(request.getXuatXu()).get());
                sanPham.setThuongHieu(thuongHieuRepository.findById(request.getThuongHieu()).get());
                sanPham.setCoAo(coAoRepository.findById(request.getCoAo()).get());
                sanPham.setTayAo(tayAoRepository.findById(request.getTayAo()).get());
                sanPham.setChatLieu(chatLieuRepository.findById(request.getChatLieu()).get());
                sanPham.setDescription(request.getDescription());
                return sanPham;
        }
}
