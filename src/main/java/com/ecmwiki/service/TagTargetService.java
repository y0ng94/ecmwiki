package com.ecmwiki.service;

import com.ecmwiki.mapper.TagTargetMapper;
import com.ecmwiki.vo.TagTargetVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class TagTargetService {

    private final TagTargetMapper tagTargetMapper;

    public List<TagTargetVO> selectTagTarget(int targetIdx) {
        return tagTargetMapper.selectTagTarget(targetIdx);
    }

    public int insertTagTarget(TagTargetVO tagTargetVO) {
        return tagTargetMapper.insertTagTarget(tagTargetVO);
    }

    public int deleteTagTarget(int targetIdx) {
        return tagTargetMapper.deleteTagTarget(targetIdx);
    }
}
