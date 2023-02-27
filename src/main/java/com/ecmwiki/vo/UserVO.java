package com.ecmwiki.vo;

import lombok.Data;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Data
@ToString
public class UserVO implements UserDetails {

    String userId;
    String userPw;
    String userName;
	String userPicture;
    String phoneNumber;
    String company;
    String registDate;
    String updateDate;
    String lastAccessDate;
    int loginTryCount;
    String approvalYn;
    String deleteYn;
    String authority;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> roles = new HashSet<>();

        for (String role : authority.split(",")) {
            roles.add(new SimpleGrantedAuthority(role));
        }

        return roles;
    }

    @Override
    public String getUsername() {
        return this.userName;
    }

    @Override
    public String getPassword() {
        return this.userPw;
    }

    // 계정 만료여부
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정 잠금여부
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 패스워드 만료여부
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 계정 사용여부
    @Override
    public boolean isEnabled() {
        return true;
    }
}
