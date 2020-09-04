/**
 * 
 */
package com.chatcor.security.handler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.NullRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.stereotype.Service;

import com.chatcor.biz.model.User;

/**
 * @author Lewis
 *
 */
@Service
public class ExAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler
        implements AuthenticationSuccessHandler {

    private static Logger logger = LoggerFactory.getLogger(ExAuthenticationSuccessHandler.class);

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth) throws IOException, ServletException {
        logger.debug("onAuthenticationSuccess {}");
        RequestCache requestCache = new NullRequestCache();
        super.setRequestCache(requestCache);
        setDefaultTargetUrl("/");
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        request.getSession().setAttribute("isAuthentication", true);
        request.getSession().setAttribute("userName", user.getUserName());
        request.getSession().setAttribute("userEmail", user.getUserEmail());
        super.onAuthenticationSuccess(request, response, auth);
    }

}
