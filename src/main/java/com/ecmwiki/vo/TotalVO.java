package com.ecmwiki.vo;

import java.util.List;

import lombok.Data;

@Data
public class TotalVO {
	private String word;
	private int totalIdx;
	private String totalTitle;
	private String userName;
	private String menuId;
	private String targetMenu;
	private String menuName;
	private String targetMenuName;
	private String linkUrl;
	private String registDate;
	private List<TagVO> tagList;
}