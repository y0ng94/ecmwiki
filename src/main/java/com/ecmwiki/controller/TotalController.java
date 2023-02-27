package com.ecmwiki.controller;

import com.ecmwiki.service.TotalService;
import com.ecmwiki.vo.TotalVO;
import com.ecmwiki.vo.UserVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RequiredArgsConstructor
@RestController
@Slf4j
public class TotalController {
	private final TotalService totalService;

	@PostMapping("/totalSearch")
	public List<TotalVO> totalSearch(@AuthenticationPrincipal UserVO userVO, @RequestBody TotalVO vo) {
		return totalService.selectTotalSearch(vo.getWord());
	}
}
