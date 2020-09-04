/**
 * 
 */
package com.chatcor.biz.svc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.chatcor.biz.dao.UserMapper;
import com.chatcor.biz.model.User;
import com.chatcor.core.BaseService;

/**
 * @author Lewis
 *
 */
@Service("userService")
@ConditionalOnProperty("chatcor.user.control")
public class UserServiceImpl extends BaseService implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        logger.debug("email: {}", userEmail);
        Map<String, String> userMap = userMapper.selectUserDetails(userEmail);
        List<GrantedAuthority> authorities = AuthorityUtils.commaSeparatedStringToAuthorityList(userMap.get("userAuth"));
        User user = new User(userMap.get("userName"), userMap.get("userEmail"), userMap.get("userPwd"), authorities);
        logger.debug("user: {}", user);
        return user;
    }

    @Override
    public boolean hasEmail(Map<String, Object> map) throws Exception {
        logger.debug("{}", map);
        return userMapper.selectUserEmail(map.get("user_email").toString()) > 0;
    }

    @Override
    public boolean newAccount(Map<String, Object> map) throws Exception {
        logger.debug("{}", map);
        map.replace("user_pwd", passwordEncoder.encode(map.get("user_pwd").toString()));
        return userMapper.insertUser(map) > 0;
    }

	@Override
	public ArrayList<Map<String, Object>> selectAllUser(String useremail) throws Exception {
        logger.debug("{}", "SelectAllUser");
        ArrayList<Map<String, Object>> alluser = userMapper.selectAllUser(useremail);
		return alluser;
	}
	
	@Override
	public boolean deleteUser(String userEmail) throws Exception {
        logger.debug("{}", "DeleteUser");
        return userMapper.deleteUser(userEmail) > 0;
	}
}
