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
						// Health checks
						.requestMatchers("/health", "/api/health").permitAll()

						// Recursos estáticos del frontend
						.requestMatchers("/", "/index.html", "/favicon.ico").permitAll()
						.requestMatchers("/static/**", "/assets/**").permitAll()
						.requestMatchers("/**/*.js", "/**/*.css", "/**/*.png", "/**/*.svg", "/**/*.ico").permitAll()

						// Endpoints públicos de la API
						.requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
						.requestMatchers("/h2-console/**").permitAll().requestMatchers("/api/properties").permitAll()
						.requestMatchers("/api/properties/{id}").permitAll()

						// Endpoints que requieren autenticación
						.requestMatchers("/api/admin/**").hasRole("ADMIN").requestMatchers("/api/rentals/**")
						.authenticated().requestMatchers("/api/users/profile").authenticated()

						// Todo lo demás de API requiere autenticación
						.requestMatchers("/api/**").authenticated()

						// Rutas del frontend SPA
						.requestMatchers("/login", "/register", "/properties", "/create-property", "/rentals", "/admin",
								"/profile")
						.permitAll().requestMatchers("/properties/{id}", "/create-rental/{id}", "/profile/{username}")
						.permitAll()

						// Permitir todo lo demás (para el SPA)
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