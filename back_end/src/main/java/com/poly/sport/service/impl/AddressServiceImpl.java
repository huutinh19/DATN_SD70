package com.poly.sport.service.impl;

import com.poly.sport.entity.Address;
import com.poly.sport.infrastructure.converter.AddressConvert;
import com.poly.sport.infrastructure.exception.NgoaiLe;
import com.poly.sport.infrastructure.request.AddressRequest;
import com.poly.sport.infrastructure.response.AddressResponse;
import com.poly.sport.repository.AddressRepository;
import com.poly.sport.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AddressServiceImpl implements AddressService {
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private AddressConvert addressConvert;

    @Override
    public Page<AddressResponse> getByAccount(AddressRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return addressRepository.getAddress(request, pageable);
    }

    @Override
    public Address create(AddressRequest request) {
        return addressRepository.save(addressConvert.convertRequestToEntity(request));
    }

//    @Override
//    public Address update(Long idAddress, AddressRequest request) {
//        Address addressUpdate = addressConvert.convertRequestToEntity(idAddress, request);
//        Address addressDefault = addressRepository.findByAccountIdAndDefaultAddress(addressUpdate.getAccount().getId(), true);
//
//        if (request.getDefaultAddress()) {
//            // Nếu yêu cầu đặt địa chỉ này làm mặc định
//            if (addressDefault != null && !addressDefault.getId().equals(idAddress)) {
//                addressDefault.setDefaultAddress(false);
//                addressRepository.save(addressDefault);
//            }
//            addressUpdate.setDefaultAddress(true);
//        } else {
//            // Nếu yêu cầu không đặt địa chỉ này làm mặc định
//            addressUpdate.setDefaultAddress(false); // Tôn trọng giá trị từ request
//        }
//
//        // Lưu địa chỉ được cập nhật
//        Address savedAddress = addressRepository.save(addressUpdate);
//
//        // Kiểm tra xem có địa chỉ mặc định nào không
//        if (addressRepository.findByAccountIdAndDefaultAddress(addressUpdate.getAccount().getId(), true) == null) {
//            // Nếu không có địa chỉ mặc định, đặt địa chỉ đầu tiên (không bị xóa, không phải địa chỉ vừa cập nhật) làm mặc định
//            List<Address> activeAddresses = addressRepository.findByAccountIdAndDeleted(addressUpdate.getAccount().getId(), false);
//            if (!activeAddresses.isEmpty()) {
//                // Tìm địa chỉ khác với địa chỉ vừa cập nhật
//                Optional<Address> newDefault = activeAddresses.stream()
//                        .filter(addr -> !addr.getId().equals(idAddress))
//                        .findFirst();
//                if (newDefault.isPresent()) {
//                    newDefault.get().setDefaultAddress(true);
//                    addressRepository.save(newDefault.get());
//                }
//            }
//        }
//
//        return savedAddress;
//    }
//
//    @Override
//    public Address delete(Long idAddress) {
//        Address address = addressRepository.findById(idAddress)
//                .orElseThrow(() -> new NgoaiLe("Địa chỉ không tồn tại!"));
//
//        // Kiểm tra số lượng địa chỉ chưa bị xóa
//        List<Address> activeAddresses = addressRepository.findByAccountIdAndDeleted(address.getAccount().getId(), false);
//        if (activeAddresses.size() > 1) {
//            // Đặt trạng thái deleted = true cho địa chỉ cần xóa
//            address.setDeleted(true);
//            Address savedAddress = addressRepository.save(address);
//
//            // Nếu địa chỉ vừa xóa là mặc định, đặt địa chỉ khác làm mặc định
//            if (address.getDefaultAddress()) {
//                Optional<Address> newDefault = activeAddresses.stream()
//                        .filter(addr -> !addr.getId().equals(idAddress) && !addr.getDeleted())
//                        .findFirst();
//                if (newDefault.isPresent()) {
//                    newDefault.get().setDefaultAddress(true);
//                    addressRepository.save(newDefault.get());
//                }
//            }
//
//            return savedAddress;
//        } else {
//            throw new NgoaiLe("Không thể xóa địa chỉ này!");
//        }
//    }


    @Override
    public Address update(Long idAddress, AddressRequest request) {
        Address addressUpdate = addressConvert.convertRequestToEntity(idAddress, request);
        if (request.getDefaultAddress()) {
            Address addressDefault = addressRepository.findByAccountIdAndDefaultAddress(addressUpdate.getAccount().getId(), true);
            if (addressDefault != null) {
                addressDefault.setDefaultAddress(false);
                addressRepository.save(addressDefault);
            }
        }
        return addressRepository.save(addressUpdate);
    }

    @Override
    public Address delete(Long idAddress) {
        Address address = addressRepository.findById(idAddress).get();

        if (addressRepository.findByAccountIdAndDeleted(address.getAccount().getId(), false).size() > 1) {
            address.setDeleted(true);
            return addressRepository.save(address);
        } else {
            throw new NgoaiLe("Không thể xóa địa chỉ này!");
        }
    }
}

