package com.ecmwiki.mapper;

import com.ecmwiki.vo.TagVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TagMapper {

    int insertTag(TagVO tagVO);

    List<TagVO> selectTag(TagVO tagVO);
}
