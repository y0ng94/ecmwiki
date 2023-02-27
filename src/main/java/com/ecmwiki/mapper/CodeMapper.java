package com.ecmwiki.mapper;

import com.ecmwiki.vo.CodeVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CodeMapper {

	int insertCodeList(List<CodeVO> voList);

	int deleteCodeList(List<CodeVO> voList);
}
