package com.chatcor.biz;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chatcor.biz.model.User;
import com.chatcor.biz.svc.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@ConditionalOnProperty("chatcor.user.control")
public class UserController {

    @Autowired
    public UserService userService;

    @RequestMapping(value = "/main/has-email", method = RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public String hasEmail(@RequestBody String strFrmData) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strFrmData, LinkedHashMap.class);
        return Boolean.toString(userService.hasEmail(map));
    }

    @RequestMapping(value = "/main/new-account", method = RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public String newAccount(@RequestBody String strFrmData) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strFrmData, LinkedHashMap.class);
        return Boolean.toString(userService.newAccount(map));
    }
    
    @RequestMapping(value = "/main/all-user", method = RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public ArrayList<Map<String, Object>> allUser(Authentication authentication) throws Exception {
    	String useremail = authentication.getName();
        return userService.selectAllUser(useremail);
    }
    
    @RequestMapping(value = "/main/del-user/{useremail}", method = RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public boolean delUser(@PathVariable("useremail") String useremail) throws Exception {
    	System.out.println("파라미터 확인" + useremail);
        return userService.deleteUser(useremail);
    }
}