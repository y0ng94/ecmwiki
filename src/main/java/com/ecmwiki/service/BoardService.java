package com.ecmwiki.service;

import com.ecmwiki.component.XtormComponent;
import com.ecmwiki.mapper.*;
import com.ecmwiki.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Transactional
@RequiredArgsConstructor
@Service
public class BoardService {

    private final BoardMapper boardMapper;
    private final FileMapper fileMapper;
    private final BoardCommentMapper boardCommentMapper;
    private final TagMapper tagMapper;
    private final TagTargetMapper tagTargetMapper;
    private final MenuMapper menuMapper;
    private final XtormComponent xtormComponent;

    public List<BoardVO> selectBoard(BoardVO vo) {
        return boardMapper.selectBoard(vo);
    }

    public BoardVO selectBoardDetails(int boardIdx) {
        return boardMapper.selectBoardDetails(boardIdx);
    }

    public void insertBoard(BoardVO boardVO, UserVO userVO) throws Exception {
        MenuVO menuVO = menuMapper.selectMenu(boardVO.getMenuId());

        int ret = boardMapper.insertBoard(boardVO);

        for (Map<String, String> newTag : boardVO.getNewTags()) {
            TagVO tagVO = new TagVO();
            tagVO.setTagName(newTag.get("tagName"));
            tagVO.setTagMasterGroup(menuVO.getTargetMenu());
            tagVO.setTagGroup(menuVO.getMenuId());
            tagVO.setColorCode(newTag.get("colorCode"));
            tagVO.setUserId(userVO.getUserId());
            tagVO.setUserName(userVO.getUsername());

            tagMapper.insertTag(tagVO);
        }

        for (Map<String, String> tag : boardVO.getTags()) {
            TagTargetVO tagTargetVO = new TagTargetVO();
            tagTargetVO.setTargetIdx(boardVO.getBoardIdx());
            tagTargetVO.setTagName(tag.get("tagName"));
            tagTargetVO.setTagMasterGroup(menuVO.getTargetMenu());
            tagTargetVO.setTagGroup(menuVO.getMenuId());
            tagTargetVO.setColorCode(tag.get("colorCode"));

            tagTargetMapper.insertTagTarget(tagTargetVO);
        }

        TagTargetVO statusVO = new TagTargetVO();
        statusVO.setTargetIdx(boardVO.getBoardIdx());
        statusVO.setTagName(boardVO.getStatus());
        statusVO.setTagMasterGroup("status");
        statusVO.setTagGroup(menuVO.getMenuId());
        statusVO.setColorCode("");

        tagTargetMapper.insertTagTarget(statusVO);

        for (String elementId : boardVO.getElementIds()) {
            FileVO fileVO = new FileVO();
            fileVO.setTargetIdx(boardVO.getBoardIdx());
            fileVO.setElementId(elementId);
            fileMapper.updateFileByElementId(fileVO);
        }
    }

    public void updateBoard(BoardVO boardVO, UserVO userVO) throws Exception {
        MenuVO menuVO = menuMapper.selectMenu(boardVO.getMenuId());

        boardMapper.updateBoard(boardVO);

        for (Map<String, String> newTag : boardVO.getNewTags()) {
            TagVO tagVO = new TagVO();
            tagVO.setTagName(newTag.get("tagName"));
            tagVO.setTagMasterGroup(menuVO.getTargetMenu());
            tagVO.setTagGroup(menuVO.getMenuId());
            tagVO.setColorCode(newTag.get("colorCode"));
            tagVO.setUserId(userVO.getUserId());
            tagVO.setUserName(userVO.getUsername());

            tagMapper.insertTag(tagVO);
        }

        tagTargetMapper.deleteTagTarget(boardVO.getBoardIdx());

        for (Map<String, String> tag : boardVO.getTags()) {
            TagTargetVO tagTargetVO = new TagTargetVO();
            tagTargetVO.setTargetIdx(boardVO.getBoardIdx());
            tagTargetVO.setTagName(tag.get("tagName"));
            tagTargetVO.setTagMasterGroup(menuVO.getTargetMenu());
            tagTargetVO.setTagGroup(menuVO.getMenuId());
            tagTargetVO.setColorCode(tag.get("colorCode"));

            tagTargetMapper.insertTagTarget(tagTargetVO);
        }

        TagTargetVO statusVO = new TagTargetVO();
        statusVO.setTargetIdx(boardVO.getBoardIdx());
        statusVO.setTagName(boardVO.getStatus());
        statusVO.setTagMasterGroup("status");
        statusVO.setTagGroup(menuVO.getMenuId());
        statusVO.setColorCode("");

        tagTargetMapper.insertTagTarget(statusVO);

        for (String elementId : boardVO.getElementIds()) {
            FileVO fileVO = new FileVO();
            fileVO.setTargetIdx(boardVO.getBoardIdx());
            fileVO.setElementId(elementId);
            fileMapper.updateFileByElementId(fileVO);
        }
    }

    public void updateBoardHits(int boardIdx) throws Exception {
        boardMapper.updateBoardHits(boardIdx);
    }

    public void deleteBoard(int boardIdx) throws Exception {

        fileMapper.deleteFileByIdx(boardIdx);

        boardCommentMapper.deleteBoardCommentByBoardIdx(boardIdx);

        tagTargetMapper.deleteTagTarget(boardIdx);

        boardMapper.deleteBoard(boardIdx);
    }
}
