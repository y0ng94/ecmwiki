package com.ecmwiki.service;

import com.ecmwiki.mapper.BoardCommentMapper;
import com.ecmwiki.mapper.BoardMapper;
import com.ecmwiki.vo.BoardCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class BoardCommentService {
    private final BoardMapper boardMapper;
    private final BoardCommentMapper boardCommentMapper;

    public List<BoardCommentVO> selectBoardComment(int boardIdx) {
        return boardCommentMapper.selectBoardComment(boardIdx);
    }

    public void insertBoardComment(BoardCommentVO boardCommentVO) throws Exception {
        boardCommentMapper.insertBoardComment(boardCommentVO);
        boardMapper.updateBoardCommentCountIncrease(boardCommentVO.getBoardIdx());
    }

    public void updateBoardComment(BoardCommentVO boardCommentVO) throws Exception {
        boardCommentMapper.updateBoardComment(boardCommentVO);
    }

    public void deleteBoardComment(int commentIdx, int boardIdx) throws Exception {
        boardCommentMapper.deleteBoardComment(commentIdx);
        boardMapper.updateBoardCommentCountDecrease(boardIdx);
    }

    public void deleteBoardCommentByBoardIdx(int boardIdx) throws Exception {
        boardCommentMapper.deleteBoardCommentByBoardIdx(boardIdx);
    }
}
