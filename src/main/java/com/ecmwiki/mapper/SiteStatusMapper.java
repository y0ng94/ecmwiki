package com.ecmwiki.mapper;

import com.ecmwiki.vo.SiteStatusVO;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SiteStatusMapper {
	List<SiteStatusVO> selectSiteStatus(SiteStatusVO vo);

	int insertSiteStatus(SiteStatusVO vo);

	int updateSiteStatus(SiteStatusVO vo);

	int deleteSiteStatus(SiteStatusVO vo);
}
