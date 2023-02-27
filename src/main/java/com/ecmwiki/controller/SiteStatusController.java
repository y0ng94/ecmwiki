package com.ecmwiki.controller;

import com.ecmwiki.service.SiteStatusService;
import com.ecmwiki.vo.SiteStatusVO;
import com.ecmwiki.vo.UserVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;


@RequiredArgsConstructor
@RestController
@Slf4j
public class SiteStatusController {
	private final SiteStatusService siteStatusService;

    /**
     * 사이트 현황 리스트를 조회한다.
     * @param vo
     * @return 사이트 현황 리스트
     */
    @PostMapping("/getSiteStatusList")
    public List<SiteStatusVO> selectSiteStatus() {
        return siteStatusService.selectSiteStatus(new SiteStatusVO());
    }

    /**
     * 사이트 현황을 조회한다.
     * @param vo
     * @return 사이트 현황
     */
    @PostMapping("/getSiteStatus")
    public SiteStatusVO selectSiteStatusTarget(@RequestBody SiteStatusVO vo) {
		return siteStatusService.selectSiteStatus(vo).get(0);
    }

	/**
	 * 새로운 사이트 현황을 추가한다.
	 * @param userVO
	 * @param vo
	 * @return Insert count
	 */
	@PostMapping("/putSiteStatus")
	public int putSiteStatus(@AuthenticationPrincipal UserVO userVO, @RequestBody SiteStatusVO vo) {
		log.info("Put Site Status [{}] ==> [{}]", vo.getSiteTitle(), userVO.getUserId());

		vo.setUserId(userVO.getUserId());
		vo.setUserName(userVO.getUsername());

		return siteStatusService.insertSiteStatus(vo);
	}

	/**
	 * 사이트 현황을 수정한다.
	 * @param userVO
	 * @param vo
	 * @return Update count
	 */
	@PostMapping("/updateSiteStatus")
	public int updateSiteStatus(@AuthenticationPrincipal UserVO userVO, @RequestBody SiteStatusVO vo) {
		log.info("Update Site Status [{}] ==> [{}]", vo.getSiteTitle(), userVO.getUserId());

		vo.setUserId(userVO.getUserId());
		vo.setUserName(userVO.getUsername());

		return siteStatusService.updateSiteStatus(vo);
	}
	
	/**
	 * 사이트 현황을 삭제한다.
	 * @param userVO
	 * @param vo
	 * @return Delete count
	 */
	@PostMapping("/deleteSiteStatus")
	public int deleteSiteStatus(@AuthenticationPrincipal UserVO userVO, @RequestBody SiteStatusVO vo) {
		log.info("Delete Site Status [{}] ==> [{}]", vo.getSiteTitle(), userVO.getUserId());
		
		return siteStatusService.deleteSiteStatus(vo);
	}

	@PostMapping("/downloadSiteStatus")
	public void downloadSiteStatus(HttpServletResponse response, @AuthenticationPrincipal UserVO userVO, @RequestBody LinkedList<Map<String, Object>> dataList) {
		Workbook workbook = new XSSFWorkbook();

		/**
		 * Sheet 1
		 */
		Sheet sheet = workbook.createSheet("사이트 현황");
		Row row = null;
		Cell cell = null;
		int rowNum = 0;
		List<CellRangeAddress> mergeList = new ArrayList<>();

		/**
		 * Options
		 */
		sheet.setColumnWidth(0, 9000);
		sheet.setColumnWidth(1, 22000);

		// new line
		row = sheet.createRow(rowNum++);

		/**
		 * Title
		 */
		row = sheet.createRow(rowNum++);
		mergeList.add(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

		cell = row.createCell(0);
		cell.setCellStyle(getMainTitleStyle(workbook));
		cell.setCellValue(dataList.stream().filter(i -> { return i.get("category").equals("site"); }).collect(Collectors.toList()).get(0).get("value") + " 사이트 현황");

		cell = row.createCell(1);
		cell.setCellStyle(getMainTitleStyle(workbook));

		/**
		 * 1. Project
		 */
		row = sheet.createRow(rowNum++);
		mergeList.add(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

		cell = row.createCell(0);
		cell.setCellStyle(getTitleStyle(workbook));
		cell.setCellValue("1. Project");

		cell = row.createCell(1);
		cell.setCellStyle(getTitleStyle(workbook));

		for (Map<String, Object> data : dataList.stream().filter(i -> { return i.get("category").equals("project"); }).collect(Collectors.toList())) {
			row = sheet.createRow(rowNum++);

			cell = row.createCell(0);
			cell.setCellStyle(getHeadStyle(workbook));
			cell.setCellValue(data.get("label").toString());
			
			cell = row.createCell(1);
			cell.setCellStyle(getBodyStyle(workbook));
			cell.setCellValue((data.get("value") == null ? "" : data.get("value").toString()));
		}

		// new line
		row = sheet.createRow(rowNum++);

		/**
		 * 2. Architecture
		 */
		row = sheet.createRow(rowNum++);
		mergeList.add(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

		cell = row.createCell(0);
		cell.setCellStyle(getTitleStyle(workbook));
		cell.setCellValue("2. Architecture");

		cell = row.createCell(1);
		cell.setCellStyle(getTitleStyle(workbook));

		for (Map<String, Object> data : dataList.stream().filter(i -> { return i.get("category").equals("architecture"); }).collect(Collectors.toList())) {
			row = sheet.createRow(rowNum++);

			cell = row.createCell(0);
			cell.setCellStyle(getHeadStyle(workbook));
			cell.setCellValue(data.get("label").toString());
			
			cell = row.createCell(1);
			cell.setCellStyle(getBodyStyle(workbook));
			cell.setCellValue((data.get("value") == null ? "" : data.get("value").toString()));
		}

		// new line
		row = sheet.createRow(rowNum++);

		/**
		 * 3. Engine
		 */
		row = sheet.createRow(rowNum++);
		mergeList.add(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

		cell = row.createCell(0);
		cell.setCellStyle(getTitleStyle(workbook));
		cell.setCellValue("3. Engine");

		cell = row.createCell(1);
		cell.setCellStyle(getTitleStyle(workbook));

		for (Map<String, Object> data : dataList.stream().filter(i -> { return i.get("category").equals("engine"); }).collect(Collectors.toList())) {
			row = sheet.createRow(rowNum++);

			cell = row.createCell(0);
			cell.setCellStyle(getHeadStyle(workbook));
			cell.setCellValue(data.get("label").toString());
			
			cell = row.createCell(1);
			cell.setCellStyle(getBodyStyle(workbook));
			cell.setCellValue((data.get("value") == null ? "" : data.get("value").toString()));
		}

		// new line
		row = sheet.createRow(rowNum++);

		/**
		 * 4. WEB & WAS
		 */
		row = sheet.createRow(rowNum++);
		mergeList.add(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

		cell = row.createCell(0);
		cell.setCellStyle(getTitleStyle(workbook));
		cell.setCellValue("4. WEB & WAS");

		cell = row.createCell(1);
		cell.setCellStyle(getTitleStyle(workbook));

		for (Map<String, Object> data : dataList.stream().filter(i -> { return i.get("category").equals("webwas"); }).collect(Collectors.toList())) {
			row = sheet.createRow(rowNum++);

			cell = row.createCell(0);
			cell.setCellStyle(getHeadStyle(workbook));
			cell.setCellValue(data.get("label").toString());
			
			cell = row.createCell(1);
			cell.setCellStyle(getBodyStyle(workbook));
			cell.setCellValue((data.get("value") == null ? "" : data.get("value").toString()));
		}

		// new line
		row = sheet.createRow(rowNum++);

		/**
		 * 5. DB
		 */
		row = sheet.createRow(rowNum++);
		mergeList.add(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

		cell = row.createCell(0);
		cell.setCellStyle(getTitleStyle(workbook));
		cell.setCellValue("5. DB");

		cell = row.createCell(1);
		cell.setCellStyle(getTitleStyle(workbook));

		for (Map<String, Object> data : dataList.stream().filter(i -> { return i.get("category").equals("db"); }).collect(Collectors.toList())) {
			row = sheet.createRow(rowNum++);

			cell = row.createCell(0);
			cell.setCellStyle(getHeadStyle(workbook));
			cell.setCellValue(data.get("label").toString());
			
			cell = row.createCell(1);
			cell.setCellStyle(getBodyStyle(workbook));
			cell.setCellValue((data.get("value") == null ? "" : data.get("value").toString()));
		}

		// new line
		row = sheet.createRow(rowNum++);

		/**
		 * 6. Server
		 */
		row = sheet.createRow(rowNum++);
		mergeList.add(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

		cell = row.createCell(0);
		cell.setCellStyle(getTitleStyle(workbook));
		cell.setCellValue("6. Server");

		cell = row.createCell(1);
		cell.setCellStyle(getTitleStyle(workbook));

		for (Map<String, Object> data : dataList.stream().filter(i -> { return i.get("category").equals("server"); }).collect(Collectors.toList())) {
			row = sheet.createRow(rowNum++);

			cell = row.createCell(0);
			cell.setCellStyle(getHeadStyle(workbook));
			cell.setCellValue(data.get("label").toString());
			
			cell = row.createCell(1);
			cell.setCellStyle(getBodyStyle(workbook));
			cell.setCellValue((data.get("value") == null ? "" : data.get("value").toString()));
		}

		// new line
		row = sheet.createRow(rowNum++);

		/**
		 * 7. Issue
		 */
		row = sheet.createRow(rowNum++);
		mergeList.add(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

		cell = row.createCell(0);
		cell.setCellStyle(getTitleStyle(workbook));
		cell.setCellValue("7. Issue");

		cell = row.createCell(1);
		cell.setCellStyle(getTitleStyle(workbook));

		for (Map<String, Object> data : dataList.stream().filter(i -> { return i.get("category").equals("issue"); }).collect(Collectors.toList())) {
			row = sheet.createRow(rowNum++);

			cell = row.createCell(0);
			cell.setCellStyle(getHeadStyle(workbook));
			cell.setCellValue(data.get("label").toString());
			
			cell = row.createCell(1);
			cell.setCellStyle(getBodyStyle(workbook));
			cell.setCellValue((data.get("value") == null ? "" : data.get("value").toString()));
		}

		// new line
		row = sheet.createRow(rowNum++);

		/**
		 * 8. Tag
		 */
		row = sheet.createRow(rowNum++);
		mergeList.add(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

		cell = row.createCell(0);
		cell.setCellStyle(getTitleStyle(workbook));
		cell.setCellValue("8. Tag");

		cell = row.createCell(1);
		cell.setCellStyle(getTitleStyle(workbook));

		for (Map<String, Object> data : dataList.stream().filter(i -> { return i.get("category").equals("tag"); }).collect(Collectors.toList())) {
			row = sheet.createRow(rowNum++);

			cell = row.createCell(0);
			cell.setCellStyle(getHeadStyle(workbook));
			cell.setCellValue(data.get("label").toString());
			
			cell = row.createCell(1);
			cell.setCellStyle(getBodyStyle(workbook));
			cell.setCellValue((data.get("value") == null ? "" : data.get("value").toString()));
		}

		/**
		 * After option
		 */
		mergeList.stream().forEach(i -> sheet.addMergedRegion(i));

		/**
		 * Sheet 2
		 */
		Sheet sheet2 = workbook.createSheet("아카이브 볼륨 CC 정보");
		Row row2 = null;
		Cell cell2 = null;
		int rowNum2 = 0;
		List<CellRangeAddress> mergeList2 = new ArrayList<>();

		/**
		 * Options
		 */
		sheet2.setColumnWidth(0, 7000);
		sheet2.setColumnWidth(1, 7000);
		sheet2.setColumnWidth(2, 7000);
		sheet2.setColumnWidth(3, 7000);
		sheet2.setColumnWidth(4, 7000);
		sheet2.setColumnWidth(5, 7000);

		// new line
		row2 = sheet2.createRow(rowNum2++);

		/**
		 * Title
		 */
		row2 = sheet2.createRow(rowNum2++);
		mergeList2.add(new CellRangeAddress(rowNum2 - 1, rowNum2 - 1, 0, 5));

		cell2 = row2.createCell(0);
		cell2.setCellStyle(getMainTitleStyle(workbook));
		cell2.setCellValue(dataList.stream().filter(i -> { return i.get("category").equals("site"); }).collect(Collectors.toList()).get(0).get("value") + " 아카이브 볼륨 정보");
		
		for (int i=1; i<6; i++) {
			cell2 = row2.createCell(i);
			cell2.setCellStyle(getMainTitleStyle(workbook));
		}

		// new line
		row2 = sheet2.createRow(rowNum2++);

		/**
		 * Archive & Volume
		 */
		row2 = sheet2.createRow(rowNum2++);
		mergeList2.add(new CellRangeAddress(rowNum2 - 1, rowNum2 - 1, 0, 5));

		cell2 = row2.createCell(0);
		cell2.setCellStyle(getTitleStyle(workbook));
		cell2.setCellValue("1. 아키이브 볼륨 설정");

		for (int i=1; i<6; i++) {
			cell2 = row2.createCell(i);
			cell2.setCellStyle(getTitleStyle(workbook));
		}

		List<Map<String, Object>> archiveList = dataList.stream().filter(i -> { return i.get("category").equals("archive"); }).collect(Collectors.toList());

		if (archiveList != null && archiveList.size() > 0) {
			row2 = sheet2.createRow(rowNum2++);

			int rowCount = archiveList.stream().map(t -> t.get("label")).distinct().collect(Collectors.toList()).size();

			for (int i=0; i<rowCount; i++) {
				cell2 = row2.createCell(i);
				cell2.setCellStyle(getHeadStyle(workbook));
				cell2.setCellValue(archiveList.get(i).get("label").toString());
			}

			int newLineCount = 0;

			for (int i=0; i<archiveList.size(); i++) {
				if (i % rowCount == 0) {
					row2 = sheet2.createRow(rowNum2++);
					newLineCount++;
				}

				cell2 = row2.createCell(i - (rowCount * (newLineCount - 1)));
				cell2.setCellStyle(getBodyStyle(workbook));
				cell2.setCellValue(archiveList.get(i).get("value").toString());
			}
		}

		// new line
		row2 = sheet2.createRow(rowNum2++);

		/**
		 * Content Class
		 */
		row2 = sheet2.createRow(rowNum2++);
		mergeList2.add(new CellRangeAddress(rowNum2 - 1, rowNum2 - 1, 0, 2));

		cell2 = row2.createCell(0);
		cell2.setCellStyle(getTitleStyle(workbook));
		cell2.setCellValue("2. 컨텐트 클래스");

		for (int i=1; i<3; i++) {
			cell2 = row2.createCell(i);
			cell2.setCellStyle(getTitleStyle(workbook));
		}

		List<Map<String, Object>> contentClassList = dataList.stream().filter(i -> { return i.get("category").equals("cc"); }).collect(Collectors.toList());

		if (contentClassList != null && contentClassList.size() > 0) {
			row2 = sheet2.createRow(rowNum2++);

			int rowCount = contentClassList.stream().map(t -> t.get("label")).distinct().collect(Collectors.toList()).size();

			for (int i=0; i<rowCount; i++) {
				cell2 = row2.createCell(i);
				cell2.setCellStyle(getHeadStyle(workbook));
				cell2.setCellValue(contentClassList.get(i).get("label").toString());
			}

			int newLineCount = 0;

			for (int i=0; i<contentClassList.size(); i++) {
				if (i % rowCount == 0) {
					row2 = sheet2.createRow(rowNum2++);
					newLineCount++;
				}

				cell2 = row2.createCell(i - (rowCount * (newLineCount - 1)));
				cell2.setCellStyle(getBodyStyle(workbook));
				cell2.setCellValue(contentClassList.get(i).get("value").toString());
			}
		}

		/**
		 * After option
		 */
		mergeList2.stream().forEach(i -> sheet2.addMergedRegion(i));

        response.setContentType("ms-vnd/excel");
        response.setHeader("Content-Disposition", "attachment;filename=example.xlsx");

		try {
			workbook.write(response.getOutputStream());
			workbook.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private CellStyle getMainTitleStyle(Workbook workbook) {
		Font font = workbook.createFont();
		font.setFontName("맑은 고딕");
		font.setBold(true);
		font.setColor(IndexedColors.WHITE.index);
		
		CellStyle style = workbook.createCellStyle();
		style.setFont(font);
		style.setWrapText(true);
		style.setFillForegroundColor(IndexedColors.CORNFLOWER_BLUE.index);
		style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderBottom(BorderStyle.THIN);
		
		return style;
	}

	private CellStyle getTitleStyle(Workbook workbook) {
		Font font = workbook.createFont();
		font.setFontName("맑은 고딕");
		font.setBold(true);
		font.setColor(IndexedColors.LIGHT_BLUE.index);
		
		CellStyle style = workbook.createCellStyle();
		style.setFont(font);
		style.setWrapText(true);
		style.setFillForegroundColor(IndexedColors.WHITE.index);
		style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		style.setAlignment(HorizontalAlignment.LEFT);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderBottom(BorderStyle.THIN);
		
		return style;
	}

	private CellStyle getHeadStyle(Workbook workbook) {
		Font font = workbook.createFont();
		font.setFontName("맑은 고딕");
		font.setBold(true);
		
		CellStyle style = workbook.createCellStyle();
		style.setFont(font);
		style.setWrapText(true);
		style.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.index);
		style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderBottom(BorderStyle.THIN);
		
		return style;
	}

	private CellStyle getBodyStyle(Workbook workbook) {
		Font font = workbook.createFont();
		font.setFontName("맑은 고딕");

		CellStyle style = workbook.createCellStyle();
		style.setFont(font);
		style.setWrapText(true);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		style.setAlignment(HorizontalAlignment.LEFT);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderBottom(BorderStyle.THIN);
		
		return style;
	}
}
