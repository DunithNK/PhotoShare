package com.example.backend2.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.example.backend2.service.JwtService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtService jwtService;

    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.and()) // Enable CORS with the configured CorsConfig
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/login/oauth2/code/google").permitAll()
                        .requestMatchers("OPTIONS/**").permitAll() // Allow preflight requests
                        .requestMatchers(HttpMethod.GET,"api/courses/**").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/courses/**").hasAnyRole("ROOT_ADMIN","COURSE_ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/courses/**").hasAnyRole("ROOT_ADMIN","COURSE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasAnyRole("ROOT_ADMIN","COURSE_ADMIN")

                        .requestMatchers(HttpMethod.GET,"api/instructors/**").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/instructors/**").hasAnyRole("ROOT_ADMIN","COURSE_ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/instructors/**").hasAnyRole("ROOT_ADMIN","COURSE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/instructors/**").hasAnyRole("ROOT_ADMIN","COURSE_ADMIN")


                        .requestMatchers(HttpMethod.GET,"api/events/**").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/events/**").hasAnyRole("ROOT_ADMIN","EVENT_ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/events/**").hasAnyRole("ROOT_ADMIN","EVENT_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasAnyRole("ROOT_ADMIN","EVENT_ADMIN")

                        .requestMatchers(HttpMethod.GET,"api/organizer/**").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/organizer/**").hasAnyRole("ROOT_ADMIN","EVENT_ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/organizer/**").hasAnyRole("ROOT_ADMIN","EVENT_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/organizer/**").hasAnyRole("ROOT_ADMIN","EVENT_ADMIN")

                        .requestMatchers(HttpMethod.GET,"api/posts/**").authenticated()


                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/api/auth/oauth2/success", true)
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}