package com.ecmwiki.service;

import com.ecmwiki.mapper.CodeMapper;
import com.ecmwiki.mapper.MenuMapper;
import com.ecmwiki.vo.CodeVO;
import com.ecmwiki.vo.MenuVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@RequiredArgsConstructor
@Service
public class MenuService {
	private final MenuMapper menuMapper;
	private final CodeMapper codeMapper;

	public List<MenuVO> selectAllMenuList() {
		return menuMapper.selectAllMenuList();
	}

	public MenuVO selectMenu(String menuId) {
		return menuMapper.selectMenu(menuId);
	}

	public int insertMenuList(List<MenuVO> voList) {
		List<CodeVO> codeVoList = new ArrayList<>();

		voList.stream().forEach(t -> {
			CodeVO codeVo = new CodeVO();

			codeVo.setCodeId(t.getMenuId());
			codeVo.setCodeName(t.getMenuName());

			codeVoList.add(codeVo);
		});

		codeMapper.insertCodeList(codeVoList);

		return menuMapper.insertMenuList(voList);
	}

	public int deleteMenuList(List<MenuVO> voList) {
		List<MenuVO> parentVoList = voList.stream().filter(t -> (t.getTargetMenu() == null || t.getTargetMenu().equals(""))).collect(Collectors.toList());
		List<CodeVO> codeVoList = new ArrayList<>();

		if (parentVoList != null && parentVoList.size() != 0)
			voList.addAll(menuMapper.selectChildMenuList(parentVoList));

		voList.stream().forEach(t -> {
			CodeVO codeVo = new CodeVO();

			codeVo.setCodeId(t.getMenuId());

			codeVoList.add(codeVo);
		});

		codeMapper.deleteCodeList(codeVoList);

		return menuMapper.deleteMenuList(voList);
	}
}
