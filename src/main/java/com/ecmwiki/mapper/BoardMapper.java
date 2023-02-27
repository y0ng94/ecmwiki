package com.ecmwiki.mapper;

import com.ecmwiki.vo.BoardVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BoardMapper {
	List<BoardVO> selectBoard(BoardVO vo);

	int insertBoard(BoardVO vo);

	BoardVO selectBoardDetails(int boardIdx);

	int updateBoard(BoardVO vo);

	int updateBoardHits(int boardIdx);

	int updateBoardLikesIncrease(int boardIdx);

	int updateBoardLikesDecrease(int boardIdx);

	int updateBoardCommentCountIncrease(int boardIdx);

	int updateBoardCommentCountDecrease(int boardIdx);

	int deleteBoard(int boardIdx);
}
