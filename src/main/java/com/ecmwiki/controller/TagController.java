package com.ecmwiki.controller;

import com.ecmwiki.service.TagService;
import com.ecmwiki.service.TagTargetService;
import com.ecmwiki.vo.TagTargetVO;
import com.ecmwiki.vo.TagVO;
import com.ecmwiki.vo.UserVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/tag")
public class TagController {

    private final TagService tagService;
    private final TagTargetService tagTargetService;

    @PostMapping("/select")
    public List<TagVO> selectTag(@RequestBody TagVO tagVO) {
        return tagService.selectTag(tagVO);
    };

    @PostMapping("/create")
    public Map<String, Object> createTag(@AuthenticationPrincipal UserVO userVO, @RequestBody TagVO tagVO) {
        Map<String, Object> result = new HashMap<String, Object>();

        if (userVO.getUserId() != null) {
            tagVO.setUserId(userVO.getUserId());
        }

        if (userVO.getUsername() != null) {
            tagVO.setUserName(userVO.getUsername());
        }

        try {
            tagService.insertTag(tagVO);

            result.put("ret", 1);
            result.put("message", "태그 등록 성공");
        } catch(Exception e) {
            log.error(e.getMessage());

            result.put("ret", 0);
            result.put("message", "태그 등록 실패");
            result.put("exception", e.getMessage());
        }

        return result;
    }

    @PostMapping("/target/select")
    public List<TagTargetVO> selectTagTarget(@RequestBody int targetIdx) {
        return tagTargetService.selectTagTarget(targetIdx);
    }

}
