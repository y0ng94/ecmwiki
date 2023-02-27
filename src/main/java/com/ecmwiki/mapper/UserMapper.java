package com.ecmwiki.mapper;

import com.ecmwiki.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
    Optional<UserVO> selectUserById(String userId);

    String selectUserName(String userId);

    List<UserVO> selectUserNotApproval();

    void insertUser(UserVO userVO);

    void updateLastAccessDate(String userId);

    void increaseLoginTryCount(String userId);

    void resetLoginTryCount(String userId);
}
