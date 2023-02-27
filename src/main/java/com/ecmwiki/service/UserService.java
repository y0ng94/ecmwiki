package com.ecmwiki.service;

import com.ecmwiki.mapper.UserMapper;
import com.ecmwiki.vo.SignVO;
import com.ecmwiki.vo.UserVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@RequiredArgsConstructor
@Service
@Slf4j
public class UserService implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        return userMapper.selectUserById(userId).orElseThrow(() -> new UsernameNotFoundException(userId));
    }

    public String selectUserName(String userId) {
        return userMapper.selectUserName(userId);
    }

    public void insertUser(SignVO signVO) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        UserVO userVO = new UserVO();

        userVO.setUserId(signVO.getUserId());
        userVO.setUserPw(passwordEncoder.encode(signVO.getUserPw()));
        userVO.setUserName(signVO.getUserName());
        userVO.setPhoneNumber(signVO.getPhoneNumber());
        userVO.setCompany(signVO.getCompany());
        userVO.setAuthority("USER");

        userMapper.insertUser(userVO);
    }
}
