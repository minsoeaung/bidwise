package com.bidwise.bids.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.oauth2.core.authorization.OAuth2AuthorizationManagers.hasScope;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

    // OAuth2 Resource Server – Using Opaque Tokens, Not jwt

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/bids/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/bids/**").access(hasScope("bids"))
                        .requestMatchers(HttpMethod.POST, "/api/bids/**").access(hasScope("bids"))
                        .requestMatchers(HttpMethod.DELETE, "/api/bids/**").access(hasScope("bids"))
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .opaqueToken(Customizer.withDefaults())
                );
        return http.build();
    }
}