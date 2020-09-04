package com.chatcor.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.thymeleaf.extras.springsecurity5.dialect.SpringSecurityDialect;

import com.chatcor.biz.BizController;
import com.chatcor.biz.svc.UserServiceImpl;
import com.chatcor.security.handler.ExAuthenticationFailureHandler;
import com.chatcor.security.handler.ExAuthenticationSuccessHandler;

@Configuration
@ConditionalOnProperty("chatcor.user.control")
@EnableWebSecurity
@EnableGlobalAuthentication
@ComponentScan(basePackages = {"com.chatcor.*"})
public class ChatCorSecurityConfig extends WebSecurityConfigurerAdapter {

    private static Logger logger = LoggerFactory.getLogger(BizController.class);

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ExAuthenticationSuccessHandler exAuthenticationSuccessHandler;

    @Autowired
    private ExAuthenticationFailureHandler exAuthenticationFailureHandler;

    @Value("${chatcor.user.control}")
    private boolean isUserControl;

    private static final String USER_NAME_PROPERTY = "txtLoginEmail";

    private static final String USER_PASSWORD_PROPERTY = "pwdLogin";

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
            .antMatchers("/*")
            .antMatchers("/css/**")
            .antMatchers("/js/**")
            .antMatchers("/scss/**")
            .antMatchers("/vendor/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        configureHeaderSecurity(http);
        if (isUserControl ) {
            configureCheckUrl(http);
        } else {
            configureNoCheckUrl(http);
        }
        configureLogin(http);
        configureLogout(http);
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        logger.debug("{}", auth);
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Bean
    public AuthenticationProvider daoAuthenticationProvider() {
        logger.debug("{}", userService);
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(userService);
        return provider;
    }

    @Bean
    public SpringSecurityDialect springSecurityDialect(){
        return new SpringSecurityDialect();
    }

    private void configureHeaderSecurity(HttpSecurity http) throws Exception {
        http.headers().xssProtection();
    }

    private void configureCheckUrl(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.authorizeRequests()
            .antMatchers("/").permitAll()
            .antMatchers("/main/has-email").permitAll()
            .antMatchers("/main/new-account").permitAll()
            .antMatchers("/main/**").hasAnyRole("USER")
            .antMatchers("/biz/license.html").permitAll()
            .antMatchers("/biz/account.html").permitAll()
            .antMatchers("/biz/**").hasAnyRole("USER")
            .anyRequest().authenticated();
    }

    private void configureNoCheckUrl(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.authorizeRequests()
            .antMatchers("/").permitAll()
            .antMatchers("/main/**").permitAll()
            .antMatchers("/biz/**").permitAll()
            .anyRequest().authenticated();
    }

    private void configureLogin(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .anyRequest()
            .authenticated()
            .and()
            .formLogin()
            .loginPage("/biz/login.html")
            .usernameParameter(USER_NAME_PROPERTY)
            .passwordParameter(USER_PASSWORD_PROPERTY)
            .successHandler(exAuthenticationSuccessHandler)         // 인증 성공
            .failureHandler(exAuthenticationFailureHandler)         // 인증 실패
            .loginProcessingUrl("/main/login")
            .permitAll();
    }

    private void configureLogout(HttpSecurity http) throws Exception {
        http.authorizeRequests().anyRequest().authenticated()
            .and()
            .logout().logoutUrl("/main/logout").permitAll()
            .logoutSuccessUrl("/")
            .invalidateHttpSession(true);
    }

}
