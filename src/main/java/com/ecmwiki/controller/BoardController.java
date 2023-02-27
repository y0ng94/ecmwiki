package com.ecmwiki.controller;

import com.ecmwiki.service.*;
import com.ecmwiki.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.StringUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;
    private final BoardLikesService boardLikesService;
    private final MenuService menuService;
    private final TagTargetService tagTargetService;

    /**
     * 메뉴 아이디에 해당하는 게시판으로 이동
     *
     * @param menuId
     * @param model
     * @return 메뉴 아이디를 전달받지 못했을 시 DefaultHandlerExceptionResolver에 의해 Error 페이지로 전달
     */
    @GetMapping("/{menuId}")
    public String board(@PathVariable String menuId, Model model) {
        MenuVO menuVO = menuService.selectMenu(menuId);

        model.addAttribute("menuId", menuVO.getMenuId());
        model.addAttribute("menuName", menuVO.getMenuName());

        return "view/board/board";
    }
    /**
     * 게시글 리스트를 조회한다.
     *
     * @param vo
     * @return 게시글 리스트
     */
    @PostMapping("/select")
    @ResponseBody
    public List<BoardVO> selectBoard(@AuthenticationPrincipal UserVO userVO, @RequestBody BoardVO vo) {
        return boardService.selectBoard(vo);
    }

    @GetMapping("/{menuId}/{boardIdx}")
    public String details(@AuthenticationPrincipal UserVO userVO, @PathVariable String menuId, @PathVariable int boardIdx, Model model, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        try {
            MenuVO menuVO = menuService.selectMenu(menuId);
            model.addAttribute("menu", menuVO);

            BoardVO boardDetails = boardService.selectBoardDetails(boardIdx);
            model.addAttribute("boardDetails", boardDetails);

            List<TagTargetVO> tagList = tagTargetService.selectTagTarget(boardIdx);
            model.addAttribute("tagList", tagList);

            int isLiked = 0;

            if (userVO != null) {
                BoardLikesVO boardLikesVO = new BoardLikesVO();
                boardLikesVO.setBoardIdx(boardIdx);
                boardLikesVO.setUserId(userVO.getUserId());

                isLiked = boardLikesService.selectBoardLikes(boardLikesVO);
            }

            model.addAttribute("isLiked", isLiked);

            HitsCountUp(boardIdx, httpServletRequest, httpServletResponse);
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return "/view/board/details";
    }

    /**
     * 메뉴 아이디에 해당하는 게시판 작성 페이지로 이동
     *
     * @param menuId
     * @param model
     * @return 메뉴 아이디를 전달받지 못했을 시 DefaultHandlerExceptionResolver에 의해 Error 페이지로 전달
     */
    @GetMapping("/write/{menuId}")
    @PreAuthorize("hasRole('USER')")
    public String write(@PathVariable String menuId, Model model) {
        MenuVO menuVO = menuService.selectMenu(menuId);

        model.addAttribute("menu", menuVO);

        return "view/board/write";
    }

    @GetMapping("/update/{boardIdx}")
    @PreAuthorize("hasRole('USER')")
    public String updateBoard(@PathVariable int boardIdx, Model model) {
        BoardVO boardDetails = boardService.selectBoardDetails(boardIdx);
        model.addAttribute("boardDetails", boardDetails);

        MenuVO menuVO = menuService.selectMenu(boardDetails.getMenuId());
        model.addAttribute("menu", menuVO);

        List<TagTargetVO> tagList = tagTargetService.selectTagTarget(boardIdx);
        model.addAttribute("tagList", tagList);

        TagTargetVO statusVO = tagList.stream().filter(tag -> StringUtils.equals("status", tag.getTagMasterGroup())).findFirst().get();
        model.addAttribute("status", statusVO.getTagName());

        return "/view/board/update";
    }

    /**
     * 게시글 등록
     *
     * @param userVO
     * @param boardVO
     * @return 게시글 등록 결과 코드, 메시지
     */
    @PostMapping("/insert")
    @ResponseBody
    @PreAuthorize("hasRole('USER')")
    public Map<String, Object> insertBoard(@AuthenticationPrincipal UserVO userVO, @Validated @RequestBody BoardVO boardVO, BindingResult bindingResult) {
        Map<String, Object> result = new HashMap<String, Object>();

        try {
            boardVO.setUserId(userVO.getUserId());
            boardVO.setUserName(userVO.getUsername());

            boardService.insertBoard(boardVO, userVO);

            result.put("ret", 1);
            result.put("message", "게시글 등록 성공");
        } catch (Exception e) {
            log.error(e.getMessage());

            result.put("ret", 0);
            result.put("message", "게시글 등록 실패");
            result.put("exception", e.getMessage());
        }

        return result;
    }

    @PostMapping("/update")
    @ResponseBody
    @PreAuthorize("hasRole('USER')")
    public Map<String, Object> updateBoard(@AuthenticationPrincipal UserVO userVO, @RequestBody BoardVO boardVO) {
        Map<String, Object> result = new HashMap<String, Object>();

        boardVO.setUserId(userVO.getUserId());
        boardVO.setUserName(userVO.getUsername());

        try {
            boardService.updateBoard(boardVO, userVO);

            result.put("ret", 1);
            result.put("message", "게시글 수정 성공");
        } catch (Exception e) {
            log.error("게시글 등록 실패 : " + e.getMessage());

            result.put("ret", 0);
            result.put("message", "게시글 수정 실패");
            result.put("exception", e.getMessage());
        }

        return result;
    }

    @GetMapping("/delete/{boardIdx}")
    @ResponseBody
    @PreAuthorize("hasRole('USER')")
    public Map<String, Object> deleteBoard(@PathVariable int boardIdx) {
        Map<String, Object> result = new HashMap<String, Object>();

        try {
            boardService.deleteBoard(boardIdx);

            result.put("ret", 1);
            result.put("message", "게시글 삭제 성공");
        } catch (Exception e) {
            log.error("게시글 삭제 실패 : " + e.getMessage());

            result.put("ret", 0);
            result.put("message", "게시글 삭제 실패");
            result.put("exception", e.getMessage());
        }

        return result;
    }

    @GetMapping("/likes/insert/{boardIdx}")
    @ResponseBody
    @PreAuthorize("hasRole('USER')")
    public Map<String, Object> insertLikes(@AuthenticationPrincipal UserVO userVO, @PathVariable int boardIdx) {
        Map<String, Object> result = new HashMap<String, Object>();

        int ret = 0;

        try {
            BoardLikesVO boardLikesVO = new BoardLikesVO();
            boardLikesVO.setBoardIdx(boardIdx);
            boardLikesVO.setUserId(userVO.getUserId());

            ret = boardLikesService.insertBoardLikes(boardLikesVO);

            result.put("ret", ret);
            result.put("message", "좋아요 등록 성공");
        } catch (Exception e) {
            log.error("좋아요 등록 실패 : " + e.getMessage());

            result.put("ret", ret);
            result.put("message", "좋아요 등록 실패");
            result.put("exception", e.getMessage());
        }

        return result;
    }

    @GetMapping("/likes/delete/{boardIdx}")
    @ResponseBody
    @PreAuthorize("hasRole('USER')")
    public Map<String, Object> deleteLikes(@AuthenticationPrincipal UserVO userVO, @PathVariable int boardIdx) {
        Map<String, Object> result = new HashMap<String, Object>();

        int ret = 0;

        try {
            BoardLikesVO boardLikesVO = new BoardLikesVO();
            boardLikesVO.setBoardIdx(boardIdx);
            boardLikesVO.setUserId(userVO.getUserId());

            ret = boardLikesService.deleteBoardLikes(boardLikesVO);

            result.put("ret", ret);
            result.put("message", "좋아요 취소 성공");
        } catch (Exception e) {
            log.error("좋아요 취소 실패 : " + e.getMessage());

            result.put("ret", ret);
            result.put("message", "좋아요 취소 실패 실패");
            result.put("exception", e.getMessage());
        }

        return result;
    }

    private void HitsCountUp(int boardIdx, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        Cookie oldCookie = null;

        Cookie[] cookies = httpServletRequest.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("hits")) {
                    oldCookie = cookie;
                }
            }
        }

        if (oldCookie != null) {
            if (!oldCookie.getValue().contains("[" + boardIdx + "]")) {
                boardService.updateBoardHits(boardIdx);
                oldCookie.setValue(oldCookie.getValue() + "_[" + boardIdx + "]");
                oldCookie.setPath("/");
                oldCookie.setMaxAge(60 * 60 * 24);
                httpServletResponse.addCookie(oldCookie);
            }
        } else {
            boardService.updateBoardHits(boardIdx);
            Cookie newCookie = new Cookie("hits", "[" + boardIdx + "]");
            newCookie.setPath("/");
            newCookie.setMaxAge(60 * 60 * 24);
            httpServletResponse.addCookie(newCookie);
        }
    }
}
