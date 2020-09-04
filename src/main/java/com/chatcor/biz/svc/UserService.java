package com.chatcor.biz.svc;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserService extends UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;

    public boolean hasEmail(Map<String, Object> map) throws Exception;

    public boolean newAccount(Map<String, Object> map) throws Exception;
    
    public ArrayList<Map<String, Object>> selectAllUser(String useremail) throws Exception;
    
    public boolean deleteUser(String useremail) throws Exception;
}
