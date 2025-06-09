package com.rentmenow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final JwtRequestFilter jwtRequestFilter;

	public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint, JwtRequestFilter jwtRequestFilter) {
		this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
		this.jwtRequestFilter = jwtRequestFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		return http.cors(cors -> cors.configurationSource(corsConfigurationSource())).csrf(csrf -> csrf.disable())
				.exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(jwtAuthenticationEntryPoint))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authz -> authz
						// API Endpoints que requieren ADMIN
						.requestMatchers("/api/admin/**").hasRole("ADMIN")

						// API Endpoints que requieren autenticación
						.requestMatchers("/api/rentals/**").authenticated().requestMatchers("/api/users/profile")
						.authenticated()

						// API Endpoints públicos
						.requestMatchers("/api/auth/**").permitAll().requestMatchers("/api/properties/**").permitAll()
						.requestMatchers("/api/users/*").permitAll().requestMatchers("/api/health").permitAll()
						.requestMatchers("/health").permitAll()

						// H2 Console (solo para desarrollo)
						.requestMatchers("/h2-console/**").permitAll()

						// Recursos estáticos
						.requestMatchers("/static/**").permitAll().requestMatchers("/assets/**").permitAll()
						.requestMatchers("*.js", "*.css", "*.png", "*.svg", "*.ico").permitAll()
						.requestMatchers("/", "/index.html", "/favicon.ico").permitAll()

						// Permitir TODAS las demás rutas (para el SPA)
						.anyRequest().permitAll())
				.headers(headers -> headers.frameOptions().disable())
				.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class).build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(Arrays.asList("*"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}