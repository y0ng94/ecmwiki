package com.ecmwiki.handler;

import com.ecmwiki.mapper.UserMapper;
import com.ecmwiki.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final UserMapper userMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        UserVO userVO = (UserVO) authentication.getPrincipal();

        userMapper.resetLoginTryCount(userVO.getUserId());

        userMapper.updateLastAccessDate(userVO.getUserId());

        response.sendRedirect("/");
    }
}