package com.ecmwiki.controller;

import com.ecmwiki.component.XtormComponent;
import com.ecmwiki.service.FileService;
import com.ecmwiki.vo.FileVO;
import com.ecmwiki.vo.UserVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;

    private final XtormComponent xtormComponent;

    @Value("${global.path.temp}")
    String tempPath;

    @PostMapping("/select")
    public List<FileVO> selectFile(@RequestBody FileVO fileVO) {
        return fileService.selectFile(fileVO);
    }

    /**
     * 파일 등록
     *
     * @param multipartFile
     * @return 파일 등록 결과 및 elementId
     * @throws IOException
     */
    @PostMapping("/create")
    public Map<String, Object> uploadContentFile(@AuthenticationPrincipal UserVO userVO,
                                                 @RequestParam("file") MultipartFile multipartFile,
                                                 @RequestParam("targetType") String targetType,
                                                 @RequestParam("fileType") String fileType) {
        Map<String, Object> result = new HashMap<String, Object>();

        File uploadFile = null;
        Path tempDirectory = null;

        try {
            tempDirectory = Paths.get(tempPath + File.separator + UUID.randomUUID());

            if (!Files.exists(tempDirectory)) {
                Files.createDirectories(tempDirectory);
            }

            uploadFile = new File(tempDirectory + File.separator + multipartFile.getOriginalFilename());

            multipartFile.transferTo(uploadFile);

            result = xtormComponent.create(uploadFile.getAbsolutePath());

            if ((int) result.get("ret") == 0) {
                FileVO fileVO = new FileVO();
                fileVO.setTargetType(targetType);
                fileVO.setElementId((String) result.get("elementId"));
                fileVO.setOrgFileName(FilenameUtils.getName(multipartFile.getOriginalFilename()));
                fileVO.setOrgFileExt(FilenameUtils.getExtension(multipartFile.getOriginalFilename()));
                fileVO.setOrgFileSize(multipartFile.getSize());
                fileVO.setUserId(userVO.getUserId());
                fileVO.setFileType(fileType);
                fileService.insertFile(fileVO);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            e.printStackTrace();
        } finally {
            try {
                if (tempDirectory != null) {
                    if (!FileSystemUtils.deleteRecursively(tempDirectory)) {
                        throw new Exception("업로드 임시 디렉토리 삭제 실패 : " + tempDirectory.getFileName());
                    }
                }
            } catch (Exception e) {
                log.error(e.getMessage());
            }
        }

        return result;
    }

    /**
     * 파일 다운로드
     *
     * @param elementId
     * @return Response File
     * @throws IOException
     */
    @GetMapping("/download/{elementId}")
    public ResponseEntity<?> downloadFile(@PathVariable String elementId) throws IOException {
        Map<String, Object> result = new HashMap<String, Object>();

        File downloadFile = null;
        Path tempDirectory = null;

        try {
            tempDirectory = Paths.get(tempPath + File.separator + UUID.randomUUID());

            if (!Files.exists(tempDirectory)) {
                Files.createDirectories(tempDirectory);
            }

            result = xtormComponent.download(tempDirectory.toString(), elementId);

            HttpHeaders headers = new HttpHeaders();

            downloadFile = new File(result.get("file").toString());

            Path downloadPath = Paths.get(downloadFile.getAbsolutePath());
            Resource resource = new InputStreamResource(Files.newInputStream(downloadPath));
			
            String filename = fileService.selectFileName(elementId);

            if (filename == null || filename.isEmpty()) {
                filename = "unknown";
            }

            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + new String(filename.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1) + "\"");
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            return ResponseEntity.ok().headers(headers).body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        } finally {
            if (downloadFile != null) {
                if (!downloadFile.delete()) {
                    log.error("다운로드 임시 파일 삭제 실패 : " + downloadFile.getAbsolutePath());
                }
            }

            if (tempDirectory != null) {
                if (!FileSystemUtils.deleteRecursively(tempDirectory)) {
                    log.error("업로드 임시 디렉토리 삭제 실패 : " + tempDirectory.getFileName());
                }
            }
        }
    }

    @GetMapping("/delete/{elementId}")
    public Map<String, Object> deleteFile(@PathVariable String elementId) throws IOException {
        Map<String, Object> result = new HashMap<String, Object>();

        try {
            result = xtormComponent.delete(elementId);

            if ((int) result.get("ret") == 0) {
                fileService.deleteFileByElementId(result.get("elementId").toString());
            }
        } catch (Exception exception) {
            log.error(exception.getMessage());
        }

        return result;
    }
}
