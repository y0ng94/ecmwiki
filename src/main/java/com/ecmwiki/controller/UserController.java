package com.ecmwiki.controller;

import com.ecmwiki.service.UserService;
import com.ecmwiki.vo.SignVO;
import com.ecmwiki.vo.UserVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;

@Slf4j
@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public String signup(@ModelAttribute("signVO") @Valid SignVO signVO, BindingResult bindingResult, Model model) {

        if (bindingResult.hasErrors()) {
            model.addAttribute("signVO", signVO);
            return "view/sign/signup";
        }

        try {
            userService.insertUser(signVO);

            model.addAttribute("alert", true);
            model.addAttribute("alertMessage", "회원가입 성공");
        } catch (DuplicateKeyException e) {
            model.addAttribute("error", true);
            model.addAttribute("errorMessage", "이미 등록된 아이디입니다");

            return "view/sign/signup";
        }

        return "view/sign/signin";
    }

    @ResponseBody
    @PostMapping("/user/select")
    public String selectUserId(@AuthenticationPrincipal UserVO userVO) {
        return (userVO != null) ? userVO.getUserId() : null;
    }
}