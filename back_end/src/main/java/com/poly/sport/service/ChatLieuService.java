package com.poly.sport.service;

import com.poly.sport.entity.ChatLieu;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.ChatLieuRequest;
import com.poly.sport.infrastructure.response.ChatLieuResponse;

public interface ChatLieuService {
    PhanTrang<ChatLieuResponse> getAll(ChatLieuRequest request);

    ChatLieu getOne(Long id);

    ChatLieu add(ChatLieuRequest request);

    ChatLieu update(Long id, ChatLieuRequest request);

    ChatLieu delete(Long id);
}
