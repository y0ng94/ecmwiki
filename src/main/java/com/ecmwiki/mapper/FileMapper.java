package com.ecmwiki.mapper;

import com.ecmwiki.vo.FileVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FileMapper {
    int insertFile(FileVO fileVO);

    List<FileVO> selectFile(FileVO fileVO);

    String selectFileName(String elementId);

    int updateFileByElementId(FileVO fileVO);

    int deleteFileByIdx(int boardIdx);

    int deleteFileByElementId(String elementId);
}
