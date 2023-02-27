package com.ecmwiki.vo;

import java.util.List;

import lombok.Data;

@Data
public class SiteStatusVO {
	private int siteIdx;
	private String siteTitle;
	private String siteData;
	private String fileKey;
	private String userId;
	private String userName;
	private String registDate;
	private List<TagVO> tagList;
}
 