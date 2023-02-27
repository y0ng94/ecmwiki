package com.ecmwiki.service;

import com.ecmwiki.mapper.BoardLikesMapper;
import com.ecmwiki.mapper.BoardMapper;
import com.ecmwiki.vo.BoardLikesVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardLikesService {
    private final BoardMapper boardMapper;
    private final BoardLikesMapper boardLikesMapper;

    public int selectBoardLikes(BoardLikesVO boardLikesVO) throws Exception {
       return boardLikesMapper.selectBoardLikes(boardLikesVO);
    }

    public int insertBoardLikes(BoardLikesVO boardLikesVO) throws Exception {
        if (boardLikesMapper.selectBoardLikes(boardLikesVO) > 0) {
            throw new Exception("이미 좋아요 한 게시글입니다.");
        } else {
            boardMapper.updateBoardLikesIncrease(boardLikesVO.getBoardIdx());
            return boardLikesMapper.insertBoardLikes(boardLikesVO);
        }
    }

    public int deleteBoardLikes(BoardLikesVO boardLikesVO) throws Exception {
        if (boardLikesMapper.selectBoardLikes(boardLikesVO) > 0) {
            boardMapper.updateBoardLikesDecrease(boardLikesVO.getBoardIdx());
            return boardLikesMapper.deleteBoardLikes(boardLikesVO);
        } else {
            throw new Exception("좋아요 하지 않은 게시글입니다.");
        }
    }
}
