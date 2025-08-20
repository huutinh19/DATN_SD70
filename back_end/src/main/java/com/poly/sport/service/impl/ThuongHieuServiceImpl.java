package com.poly.sport.service.impl;

import com.poly.sport.entity.ThuongHieu;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.converter.ThuongHieuConvert;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.ThuongHieuRequest;
import com.poly.sport.infrastructure.response.ThuongHieuResponse;
import com.poly.sport.repository.ThuongHieuRepository;
import com.poly.sport.service.ThuongHieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ThuongHieuServiceImpl implements ThuongHieuService {
    @Autowired
    private ThuongHieuRepository repository;

    @Autowired
    private ThuongHieuConvert thuongHieuConvert;

    public PhanTrang<ThuongHieuResponse> getAll(ThuongHieuRequest request) {
        return new PhanTrang<>(repository.getAllThuongHieu(request, PageRequest.of(request.getPage() - 1, request.getSizePage())));
    }


    public ThuongHieu getOne(Long id) {
        return repository.findById(id).get();
    }


    public ThuongHieu add(ThuongHieuRequest request) {
        if (repository.existsByNameIgnoreCase(request.getName())) {
            throw new NgoaiLe("Thương hiệu " + request.getName() + " đã tồn tại!");
        }
        ThuongHieu thuongHieu = thuongHieuConvert.addconvertRequest(request);
        return repository.save(thuongHieu);
    }

    public ThuongHieu update(Long id, ThuongHieuRequest request) {
        ThuongHieu name = repository.findById(id).get();
        if (repository.existsByNameIgnoreCase(request.getName())) {
            if (name.getName().equals(request.getName())){
                return repository.save(thuongHieuConvert.convertRequestToEntity(name,request));
            }
            throw new NgoaiLe("Thương hiệu " + request.getName() + " đã tồn tại!");
        }
        else {
            return repository.save(thuongHieuConvert.convertRequestToEntity(name,request));
        }


    }

    public ThuongHieu delete(Long id) {
        ThuongHieu thuongHieu = this.getOne(id);
        thuongHieu.setDeleted(!thuongHieu.getDeleted());
        return repository.save(thuongHieu);
    }


}
