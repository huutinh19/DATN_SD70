package com.poly.sport.infrastructure.session;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDetailToken {
    private String fullName;
    private String email;
    private Long id;
    private String role;
}
