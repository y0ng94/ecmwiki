package com.ecmwiki.service;

import com.ecmwiki.mapper.TotalMapper;
import com.ecmwiki.vo.TotalVO;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class TotalService {
	private final TotalMapper totalMapper;

	public List<TotalVO> selectTotalSearch(String word) {
		return totalMapper.selectTotalSearch(word);
	}
}
