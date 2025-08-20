package com.poly.sport.repository;


import com.poly.sport.entity.CartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICartDetailRepository extends JpaRepository<CartDetail, Long> {
    List<CartDetail> findByCartId(Long idCart);

    Boolean existsByCartIdAndShoeDetailId(Long cart, Long shoeDetail);
    CartDetail findByCartIdAndShoeDetailId(Long cart, Long shoeDetail);
}
