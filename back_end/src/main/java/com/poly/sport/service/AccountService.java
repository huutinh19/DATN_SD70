package com.poly.sport.service;

import com.poly.sport.entity.Account;
import com.poly.sport.infrastructure.common.PhanTrang;
import com.poly.sport.infrastructure.request.AccountRequest;
import com.poly.sport.infrastructure.response.AccountResponse;

public interface AccountService {
    PhanTrang<AccountResponse> getAll(AccountRequest request);

    Account getOne(Long id, String roleName);

    Account create(AccountRequest request, String roleName);

    Account update(Long id, AccountRequest request);

    Account delete(Long id);
}
