package com.ecmwiki.service;

import com.ecmwiki.mapper.FileMapper;
import com.ecmwiki.vo.FileVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class FileService {
    private final FileMapper fileMapper;

    public List<FileVO> selectFile(FileVO fileVO) {
        return fileMapper.selectFile(fileVO);
    }

    public String selectFileName(String elementId) {
        return fileMapper.selectFileName(elementId);
    }

    public void insertFile(FileVO fileVO) throws Exception {
        fileMapper.insertFile(fileVO);
    }

    public void deleteFileByIdx(int targetIdx) throws Exception {
        fileMapper.deleteFileByIdx(targetIdx);
    }

    public void deleteFileByElementId(String elementId) throws Exception {
        fileMapper.deleteFileByElementId(elementId);
    }
}
