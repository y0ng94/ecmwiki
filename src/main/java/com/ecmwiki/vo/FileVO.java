package com.ecmwiki.vo;

import lombok.Data;

@Data
public class FileVO {
    int targetIdx;
    String targetType;
    String fileType;
    String elementId;
    String orgFileName;
    String orgFileExt;
    long orgFileSize;
    String userId;
    String registDate;
}
