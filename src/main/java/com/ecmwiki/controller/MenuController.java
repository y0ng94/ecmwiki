package com.ecmwiki.controller;

import com.ecmwiki.service.MenuService;
import com.ecmwiki.vo.MenuVO;
import com.ecmwiki.vo.UserVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
public class MenuController {
	private final MenuService menuService;

	/**
	 * 모든 메뉴를 조회한다.
	 * @return 메뉴 리스트
	 */
	@GetMapping("/getMenu")
	public List<MenuVO> getMenu(@AuthenticationPrincipal UserVO userVO) {
		if (userVO != null) {
			log.debug("Get list [all menu] ==> [{}]", userVO.getUserId());
		}

		return menuService.selectAllMenuList();
	}

	/**
	 * 새로운 메뉴를 추가한다.
	 * @param voList
	 * @return Insert count
	 */
	@PostMapping("/putMenu")
	public int putMenu(@AuthenticationPrincipal UserVO userVO, @RequestBody List<MenuVO> voList) {
		if (userVO != null) {
			log.info("Put menu [{}] ==> [{}]", voList.stream().map(t -> t.getMenuId()).collect(Collectors.joining(", ")), userVO.getUserId());
		}

		return menuService.insertMenuList(voList);
	}

	/**
	 * 메뉴를 삭제하고, 하위에 해당하는 메뉴 또한 삭제한다.
	 * @param voList
	 * @return delete count
	 */
	@PostMapping("/deleteMenu")
	public int deleteMenu(@AuthenticationPrincipal UserVO userVO, @RequestBody List<MenuVO> voList) {
		if (userVO != null) {
			log.info("Delete menu [{}] ==> [{}]", voList.stream().map(t -> t.getMenuId()).collect(Collectors.joining(", ")), userVO.getUserId());
		}

		return menuService.deleteMenuList(voList);
	}
}
