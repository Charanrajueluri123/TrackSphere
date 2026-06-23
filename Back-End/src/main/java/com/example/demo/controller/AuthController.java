package com.example.demo.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authservice;
	
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/register")
	public String register(@RequestBody RegisterRequest request) {
		return authservice.register(request);
	}
	
	@PostMapping("/login")
	public String login(@RequestBody LoginRequest req) {
		System.out.println("login controller called.");
		return authservice.login(req);
	}
}
