package com.ecmwiki.mapper;

import com.ecmwiki.vo.BoardLikesVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardLikesMapper {

    int selectBoardLikes(BoardLikesVO boardLikesVO);

    int insertBoardLikes(BoardLikesVO boardLikesVO);

    int deleteBoardLikes(BoardLikesVO boardLikesVO);
}
