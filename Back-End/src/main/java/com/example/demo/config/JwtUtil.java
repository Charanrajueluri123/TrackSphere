package com.example.demo.config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	private static final String SECRET = "mysecretkeymysecretkeymysecretkeymysecretkey";
	private static final long EXPIRATION = 1000 * 60 * 60 * 24;

	public String generateToken(String email,String role) {
		return Jwts.builder().subject(email).claim("role", role).issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
				.signWith(Keys.hmacShaKeyFor(SECRET.getBytes())).compact();
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser().verifyWith(getSignKey()).build().parseSignedClaims(token).getPayload();
	}
	
	private SecretKey getSignKey() {
		return Keys.hmacShaKeyFor(SECRET.getBytes());
	}

	// Validate Token
	public boolean validateToken(String token, String email) {
		return email.equals(extractUsername(token)) && !isTokenExpired(token);
	}

	public String extractUsername(String token) {
		return extractAllClaims(token).getSubject();
	}

	public boolean isTokenExpired(String token) {
		return extractAllClaims(token).getExpiration().before(new Date());
	}
}
