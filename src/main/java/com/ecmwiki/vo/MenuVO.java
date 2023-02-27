package com.ecmwiki.vo;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class MenuVO {
	@NotBlank(message = "메뉴 아이디를 입력해주세요.")
    private String menuId;
    @NotBlank(message = "메뉴 명을 입력해주세요.")
    private String menuName;
    @NotBlank(message = "메뉴 순서를 입력해주세요.")
    private int menuOrder;
    private String menuDescription;
    private String targetMenu;
    private String targetMenuName;
    private String linkUrl;
    private String registDate;
    private String boardRegistDate;
}
 