/**
 * 
 */
package com.chatcor.biz.model;

import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityCoreVersion;

/**
 * @author Lewis
 *
 */
public class User extends org.springframework.security.core.userdetails.User {

    private static final long serialVersionUID = SpringSecurityCoreVersion.SERIAL_VERSION_UID;

    private String userName;

    private String userPwd;

    private String userEmail;

    private String userAuth;

    public User(String userName, String userEmail, String password, List<GrantedAuthority> userAuthList) {
        super(userEmail, password, true, true, true, true, userAuthList);
        this.userName = userName;
        this.userPwd = password;
        this.userEmail = userEmail;
        this.userAuth = userAuthList.get(0).getAuthority();
    }

    public String getUserName() {
        return userName;
    }
    
    public String getUserEmail() {
        return userEmail;
    }

    public String getUserPwd() {
        return userPwd;
    }

    public String getUserAuth() {
        return userAuth;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(super.toString()).append(": ");
        sb.append("UserEmail: ").append(this.userEmail).append("; ");
        return sb.toString();
    }

}
