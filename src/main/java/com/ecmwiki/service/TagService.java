package com.ecmwiki.service;

import com.ecmwiki.mapper.TagMapper;
import com.ecmwiki.vo.TagVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class TagService {

    private final TagMapper tagMapper;

    public List<TagVO> selectTag(TagVO tagVO) {
        return tagMapper.selectTag(tagVO);
    }

    public void insertTag(TagVO tagVO) throws Exception {
        tagMapper.insertTag(tagVO);
    }
}
