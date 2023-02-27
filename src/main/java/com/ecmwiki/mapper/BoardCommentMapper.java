package com.ecmwiki.mapper;

import com.ecmwiki.vo.BoardCommentVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BoardCommentMapper {
    List<BoardCommentVO> selectBoardComment(int boardIdx);

    int insertBoardComment(BoardCommentVO boardCommentVO);

    int updateBoardComment(BoardCommentVO boardCommentVO);

    int deleteBoardComment(int commentIdx);

    int deleteBoardCommentByBoardIdx(int boardIdx);
}
