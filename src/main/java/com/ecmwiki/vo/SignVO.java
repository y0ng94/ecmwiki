package com.ecmwiki.vo;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.*;

@Data
@NoArgsConstructor
@ToString
public class SignVO {
    @NotBlank(message = "이메일은 필수 입력값입니다")
    @Email(message = "이메일 입력 양식에 맞지 않습니다")
    private String userId;
    @NotBlank(message = "비밀번호는 필수 입력값입니다")
    @Pattern(regexp = "(?=.*[0-9])(?=.*[a-z])(?=.*\\W)(?=\\S+$).{8,20}", message = "비밀번호는 8~20자 사이 영문자, 숫자, 특수문자 조합이어야 합니다")
    private String userPw;
    @NotBlank(message = "사용자 이름은 필수 입력값입니다")
    private String userName;
    @Size(min = 9, max = 11, message = "전화번호 입력 양식에 맞지 않습니다")
    @PositiveOrZero(message = "전화번호 입력 양식에 맞지 않습니다")
    private String phoneNumber;
    private String company;

    @Builder
    public SignVO(String userId, String userPw, String userName, String phoneNumber, String company) {
        this.userId = userId;
        this.userPw = userPw;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
        this.company = company;
    }
}
