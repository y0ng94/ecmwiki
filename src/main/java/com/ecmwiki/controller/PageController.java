package com.ecmwiki.controller;

import com.ecmwiki.service.*;
import com.ecmwiki.vo.MenuVO;
import com.ecmwiki.vo.SignVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@Controller
@RequiredArgsConstructor
public class PageController {

    private final MenuService menuService;
    private final BoardService boardService;
    private final FileService fileService;
    private final BoardLikesService boardLikesService;
    private final TagTargetService tagTargetService;
    private final UserService userService;

    /**
     * 메인 페이지 호출
     *
     * @param model
     * @return index 페이지
     */
    @GetMapping("/")
    public String index(Model model) {
        return "view/index";
    }

    /**
     * 로그인 페이지 호출
     *
     * @param error
     * @param errorMessage
     * @param model
     * @return 로그인 페이지
     */
    @GetMapping("/signin")
    public String signin(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "errorMessage", required = false) String errorMessage,
            Model model) {

        model.addAttribute("error", error);
        model.addAttribute("errorMessage", errorMessage);

        return "view/sign/signin";
    }

    /**
     * 회원가입 페이지 호출
     *
     * @param model
     * @return 회원가입 페이지
     */
    @GetMapping("/signup")
    public String signup(Model model) {
        model.addAttribute("signVO", new SignVO());

        return "view/sign/signup";
    }

    /**
     * 마이 페이지 호출
     *
     * @param model
     * @return 마이 페이지
     */
    @GetMapping("/mypage")
    public String mypage(Model model) {
        model.addAttribute("signVO", new SignVO());

        return "view/sign/mypage";
    }

    @GetMapping("/workbook/{menuId}")
    public String workbook(@PathVariable String menuId, Model model) {
        MenuVO menuVO = menuService.selectMenu(menuId);
        model.addAttribute("menuId", menuVO.getMenuId());
        model.addAttribute("menuName", menuVO.getMenuName());

        return "view/workbook/" + menuId;
    }

    @GetMapping("/support/engineer")
    public String engineer(Model model) {
        return "view/support/engineer";
    }

    @GetMapping("/download/solution")
    public String solution(Model model) {
        return "view/download/solution";
    }

    @GetMapping("/download/document")
    public String docs(Model model) {
        return "view/download/document";
    }

    @GetMapping("/download/utility")
    public String utility(Model model) {
        return "view/download/utility";
    }

    @GetMapping("/userList")
    public String userlist(Model model) {
        return "view/community/userlist";
    }

    @GetMapping("/workingCalendar")
    public String workingCalendar(Model model) {
        return "view/community/workingCalendar";
    }

    @GetMapping("/siteStatus")
    public String siteStatus(Model model, @RequestParam(required = false) String message) {
        MenuVO vo = menuService.selectMenu("siteStatus");

        model.addAttribute("menuId", vo.getMenuId());
        model.addAttribute("menuName", vo.getMenuName());
        model.addAttribute("targetMenu", vo.getTargetMenu());
        model.addAttribute("message", message);

        return "view/news/siteStatus";
    }

    @GetMapping("/siteStatus/{siteIdx}")
    public String siteStatusDetails(@PathVariable int siteIdx, Model model, @RequestParam(required = false) String message) {
        MenuVO vo = menuService.selectMenu("siteStatus");

        model.addAttribute("menuId", vo.getMenuId());
        model.addAttribute("menuName", vo.getMenuName());
        model.addAttribute("targetMenu", vo.getTargetMenu());
        model.addAttribute("siteIdx", siteIdx);
		model.addAttribute("message", message);

        return "view/news/siteStatusDetails";
    }

    @GetMapping("/siteStatus/write")
    public String siteStatusWrite(Model model) {
        MenuVO vo = menuService.selectMenu("siteStatus");

        model.addAttribute("menuId", vo.getMenuId());
        model.addAttribute("menuName", vo.getMenuName());
        model.addAttribute("targetMenu", vo.getTargetMenu());

        return "view/news/siteStatusWrite";
    }

    @GetMapping("/siteStatus/update/{siteIdx}")
    public String siteStatusUpdate(@PathVariable int siteIdx, Model model) {
        MenuVO vo = menuService.selectMenu("siteStatus");

        model.addAttribute("menuId", vo.getMenuId());
        model.addAttribute("menuName", vo.getMenuName());
        model.addAttribute("targetMenu", vo.getTargetMenu());
        model.addAttribute("siteIdx", siteIdx);

        return "view/news/siteStatusUpdate";
    }

    @GetMapping("/total/{word}")
    public String total(@PathVariable String word, Model model) {

        model.addAttribute("word", word);

        return "view/total";
    }
}