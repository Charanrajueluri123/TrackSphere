package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.config.JwtUtil;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class AuthService {
	
	private final UserRepository userRepository;
	
	private final PasswordEncoder passwordEncoder;
	
	private final AuthenticationManager autenticatoinManager;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	
	public String register(RegisterRequest request) {
		if(userRepository.existsByEmail(request.getEmail())) {
			throw new RuntimeException("Email Already Exists");
		}
		
		User user=User.builder()
						.name(request.getName())
						.email(request.getEmail())
						.password(passwordEncoder.encode(request.getPassword()))
						.role(request.getRole())
						.build();
		userRepository.save(user);
		
		return "user registered successfully";
						
	}
	
	public String login(LoginRequest request) {
		System.out.println(request.getEmail());
		System.out.println("Searching Email = [" + request.getEmail() + "]");
//		 User u1=userRepository.existsByEmail(request.getEmail());
//		 User user = userRepository.findByEmail(request.getEmail())
//		            .orElseThrow(() -> new RuntimeException("User Not Found"));

//		    System.out.println("Login called for: " + user.getEmail());
		
//		if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//			throw new RuntimeException("Invalid Password");
//		}
//		return "Login Succesful";
		   autenticatoinManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
		   
		   User user = userRepository.findByEmail(
		            request.getEmail())
		            .orElseThrow(() ->
		                    new RuntimeException(
		                            "User Not Found"));
		   return jwtUtil.generateToken(user.getEmail(),user.getRole().name());
		
	}
}
