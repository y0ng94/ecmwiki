package com.ecmwiki.mapper;

import com.ecmwiki.vo.TotalVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TotalMapper {
	List<TotalVO> selectTotalSearch(String word);
}
