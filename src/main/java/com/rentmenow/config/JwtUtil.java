package com.rentmenow.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
	private final String SECRET_KEY = "mySecretKeyForJWTTokenGenerationAndValidationWithMoreCharactersToMakeItSecureEnoughForHS512Algorithm";
	private final int JWT_TOKEN_VALIDITY = 5 * 60 * 60; // 5 horas

	public String getUsernameFromToken(String token) {
		return getClaimFromToken(token, Claims::getSubject);
	}

	public Date getExpirationDateFromToken(String token) {
		return getClaimFromToken(token, Claims::getExpiration);
	}

	public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = getAllClaimsFromToken(token);
		return claimsResolver.apply(claims);
	}

	private Claims getAllClaimsFromToken(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
	}

	private Boolean isTokenExpired(String token) {
		final Date expiration = getExpirationDateFromToken(token);
		return expiration.before(new Date());
	}

	public String generateToken(String username) {
		Map<String, Object> claims = new HashMap<>();
		return createToken(claims, username);
	}

	private String createToken(Map<String, Object> claims, String subject) {
		return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
				.signWith(getSigningKey(), SignatureAlgorithm.HS512).compact();
	}

	private Key getSigningKey() {
		return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
	}

	public Boolean validateToken(String token, String username) {
		final String tokenUsername = getUsernameFromToken(token);
		return (tokenUsername.equals(username) && !isTokenExpired(token));
	}
}