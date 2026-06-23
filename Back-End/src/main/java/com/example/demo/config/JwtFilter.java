package com.example.demo.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;

	private final CustomUserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)

			throws ServletException, IOException {
		System.out.println("Jwt Filter called..");
		System.out.println("Method: " + request.getMethod());
		System.out.println("URI: " + request.getRequestURI());
		
		if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
		    filterChain.doFilter(request, response);
		    return;
		}
		
		String authHeader = request.getHeader("Authorization");
		System.out.println("Auth header:"+authHeader);
		String token = null;
		String email = null;
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			token = authHeader.substring(7);
			email = jwtUtil.extractUsername(token);
		}
		System.out.println("token is called.. " + token);
		if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails = userDetailsService.loadUserByUsername(email);
			System.out.println(userDetails.getUsername() + " " + email);
			if (jwtUtil.validateToken(token, userDetails.getUsername())) {
				System.out.println("Sucessfully validated");
				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, null,
						userDetails.getAuthorities());
				SecurityContextHolder.getContext().setAuthentication(authToken);
			}
		}
		filterChain.doFilter(request, response);
	}
}
