package com.ecmwiki.config;

import com.ecmwiki.handler.AjaxAuthenticationEntryPoint;
import com.ecmwiki.handler.CustomAuthFailureHandler;
import com.ecmwiki.handler.CustomAuthSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    private final CustomAuthSuccessHandler customAuthSuccessHandler;
    private final CustomAuthFailureHandler customAuthFailureHandler;
    private final UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable();

        http
                .authorizeRequests()
                .anyRequest().permitAll();

        http
                .formLogin()
                .loginPage("/signin")
                .loginProcessingUrl("/login")
                .usernameParameter("userId")
                .passwordParameter("userPw")
                .successHandler(customAuthSuccessHandler)
                .failureHandler(customAuthFailureHandler);

        http
                .logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true);

        http
                .rememberMe().rememberMeParameter("remember-me").tokenValiditySeconds(604800).alwaysRemember(false).userDetailsService(userDetailsService);

        http
                .sessionManagement().maximumSessions(1).maxSessionsPreventsLogin(true);

        http
                .httpBasic().and();

        http
                .exceptionHandling()
                .authenticationEntryPoint(new AjaxAuthenticationEntryPoint("/signin"));

        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring().antMatchers("/vendors/**", "/fonts/**", "/css/**", "/js/**", "/img/**");
    }
}