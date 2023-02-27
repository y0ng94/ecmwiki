package com.ecmwiki.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecmwiki.mapper.SiteStatusMapper;
import com.ecmwiki.mapper.TagTargetMapper;
import com.ecmwiki.vo.SiteStatusVO;
import com.ecmwiki.vo.TagTargetVO;
import com.ecmwiki.vo.TagVO;

import lombok.RequiredArgsConstructor;

@Transactional
@RequiredArgsConstructor
@Service
public class SiteStatusService {
	private final SiteStatusMapper siteStatusMapper;
	private final TagTargetMapper tagTargetMapper;

	public List<SiteStatusVO> selectSiteStatus(SiteStatusVO vo) {
		return siteStatusMapper.selectSiteStatus(vo);
	}

	public int insertSiteStatus(SiteStatusVO vo) {
		int insertCount = siteStatusMapper.insertSiteStatus(vo);

		for (TagVO tagVO : vo.getTagList()) {
			TagTargetVO tagTargetVO = new TagTargetVO();

			tagTargetVO.setTargetIdx(vo.getSiteIdx());
			tagTargetVO.setTagName(tagVO.getTagName());
			tagTargetVO.setTagMasterGroup(tagVO.getTagMasterGroup());
			tagTargetVO.setTagGroup(tagVO.getTagGroup());
			tagTargetVO.setColorCode(tagVO.getColorCode());
			
			tagTargetMapper.insertTagTarget(tagTargetVO);
		}

		return insertCount;
	}

	public int updateSiteStatus(SiteStatusVO vo) {
		int updateCount = siteStatusMapper.updateSiteStatus(vo);

		tagTargetMapper.deleteTagTarget(vo.getSiteIdx());

		for (TagVO tagVO : vo.getTagList()) {
			TagTargetVO tagTargetVO = new TagTargetVO();

			tagTargetVO.setTargetIdx(vo.getSiteIdx());
			tagTargetVO.setTagName(tagVO.getTagName());
			tagTargetVO.setTagMasterGroup(tagVO.getTagMasterGroup());
			tagTargetVO.setTagGroup(tagVO.getTagGroup());
			tagTargetVO.setColorCode(tagVO.getColorCode());
			
			tagTargetMapper.insertTagTarget(tagTargetVO);
		}

		return updateCount;
	}

	public int deleteSiteStatus(SiteStatusVO vo) {
		int deleteCount = siteStatusMapper.deleteSiteStatus(vo);

		tagTargetMapper.deleteTagTarget(vo.getSiteIdx());

		return deleteCount;
	}
}
