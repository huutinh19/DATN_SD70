package com.poly.sport.service.impl;
import com.poly.sport.entity.MauSac;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.converter.MauSacConvert;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.MauSacRequest;
import com.poly.sport.infrastructure.response.MauSacResponse;
import com.poly.sport.repository.MauSacRepository;
import com.poly.sport.service.MauSacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class MauSacServiceImpl implements MauSacService {
    @Autowired
    private MauSacRepository repository;

    @Autowired
    private MauSacConvert mauSacConvert;



    public PhanTrang<MauSacResponse> getAll(MauSacRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PhanTrang<>(repository.getAllMauSac(request, pageable));
    }
    public MauSac getOne(Long id){
        return repository.findById(id).get();
    }

    public MauSac create(MauSacRequest request){
        if (repository.existsByNameIgnoreCase(request.getName())){
            throw new NgoaiLe("Màu " + request.getName() + " đã tồn tại");
        }
        MauSac mauSac = mauSacConvert.addconvertRequest(request);
        return repository.save(mauSac);
    }

    public MauSac update(Long id, MauSacRequest request){
        MauSac name = repository.findById(id).get();
        if (repository.existsByNameIgnoreCase(request.getName())){
            if (name.getName().equals(request.getName())){
                return repository.save(mauSacConvert.convertRequestToEntity(name,request));
            }
            throw new NgoaiLe("Màu" + request.getName() + "đã tồn tại");

        }else {
            return repository.save(mauSacConvert.convertRequestToEntity(name,request));
        }

    }

    public MauSac delete(Long id){
        MauSac mauSac = this.getOne(id);
        mauSac.setDeleted(!mauSac.getDeleted());
        return repository.save(mauSac);
    }

}
