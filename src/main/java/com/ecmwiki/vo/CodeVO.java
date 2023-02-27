package com.ecmwiki.vo;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CodeVO {
    @NotBlank(message = "코드 아이디를 입력해주세요.")
	private String codeId;
	private String codeName;
	private String codeGroup;
	private String description;
	private String registDate;
}
