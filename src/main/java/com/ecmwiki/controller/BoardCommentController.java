package com.ecmwiki.controller;

import com.ecmwiki.service.BoardCommentService;
import com.ecmwiki.vo.BoardCommentVO;
import com.ecmwiki.vo.UserVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/comment")
public class BoardCommentController {

    private final BoardCommentService boardCommentService;

    @PostMapping("/select")
    public List<BoardCommentVO> selectComment(@RequestBody int boardIdx) {
        return boardCommentService.selectBoardComment(boardIdx);
    }

    @PostMapping("/insert")
    public Map<String, Object> insertComment(@AuthenticationPrincipal UserVO userVO, @RequestBody BoardCommentVO boardCommentVO) {
        Map<String, Object> result = new HashMap<String, Object>();
        
        boardCommentVO.setUserId(userVO.getUserId());
        boardCommentVO.setUserName(userVO.getUsername());
        
        try {
            boardCommentService.insertBoardComment(boardCommentVO);

            result.put("ret", 1);
            result.put("message", "댓글 등록 성공");
        } catch (Exception e) {
            log.error("댓글 등록 실패 : " + e.getMessage());

            result.put("ret", 0);
            result.put("message", "댓글 등록 실패");
            result.put("exception", e.getMessage());
        }

        return result;
    }

    @PostMapping("/update")
    public Map<String, Object> updateComment(@RequestBody BoardCommentVO boardCommentVO) {
        Map<String, Object> result = new HashMap<String, Object>();

        try {
            boardCommentService.updateBoardComment(boardCommentVO);

            result.put("ret", 1);
            result.put("message", "댓글 수정 성공");
        } catch (Exception e) {
            log.error("댓글 수정 실패 : " + e.getMessage());

            result.put("ret", 0);
            result.put("message", "댓글 수정 실패");
            result.put("exception", e.getMessage());
        }
        
        return result;
    }

    @PostMapping("/delete")
    public Map<String, Object> insertComment(@RequestBody BoardCommentVO boardCommentVO) {
        Map<String, Object> result = new HashMap<String, Object>();

        try {
            boardCommentService.deleteBoardComment(boardCommentVO.getCommentIdx(), boardCommentVO.getBoardIdx());

            result.put("ret", 1);
            result.put("message", "댓글 삭제 성공");
        } catch (Exception e) {
            log.error("댓글 삭제 실패 : " + e.getMessage());

            result.put("ret", 0);
            result.put("message", "댓글 삭제 실패");
            result.put("exception", e.getMessage());
        }
        
        return result;
    }

}