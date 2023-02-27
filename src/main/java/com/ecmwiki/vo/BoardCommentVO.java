package com.ecmwiki.vo;

import lombok.Data;

@Data
public class BoardCommentVO {
    int commentIdx;
    int boardIdx;
    int targetIdx;
    String targetUserName;
    String commentContent;
    String userId;
    String userName;
    String registDate;
    String updateDate;
}
