package com.ecmwiki.mapper;

import com.ecmwiki.vo.TagTargetVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TagTargetMapper {

    int insertTagTarget(TagTargetVO tagTargetVO);

    List<TagTargetVO> selectTagTarget(int targetIdx);

    int deleteTagTarget(int targetIdx);
}
