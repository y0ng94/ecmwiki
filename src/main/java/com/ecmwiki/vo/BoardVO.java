package com.ecmwiki.vo;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

@Data
public class BoardVO {
    private int boardIdx;
    @NotBlank
    private String boardTitle;
    @NotBlank
    private String boardContent;
    private String boardTemporary;
    private String userId;
    private String userName;
    private String menuId;
    private String registDate;
    private String updateDate;
    private int boardHits;
    private int boardLikes;
    private int boardCommentCount;
    private String status;
    private String colorCode;
    private List<Map<String, String>> tags;
    private List<Map<String, String>> newTags;
    private List<String> elementIds;
}
