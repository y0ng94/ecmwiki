package com.ecmwiki.mapper;

import com.ecmwiki.vo.MenuVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MenuMapper {
	List<MenuVO> selectAllMenuList();

	MenuVO selectMenu(String menuId);

	List<MenuVO> selectChildMenuList(List<MenuVO> voList);

	int insertMenuList(List<MenuVO> voList);

	int deleteMenuList(List<MenuVO> voList);
}
