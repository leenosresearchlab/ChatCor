/**
 * 
 */
package com.chatcor.biz.dao;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

/**
 * ChatCor 사용자 관리 Dao Mapper 인터페이스
 * 
 * @author Lewis
 *
 */
@Mapper
public interface UserMapper {

	public Map<String, String> selectUserDetails(String userEmail);

    public int selectUserEmail(String userEmail);

    public int insertUser(Map<String, Object> user);
    
	public ArrayList<Map<String, Object>> selectAllUser(String useremail);
	
	public int deleteUser(String userEmail);

}
