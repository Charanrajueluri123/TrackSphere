package com.example.demo.config;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class CustomUserDetailsService implements UserDetailsService{

	private final UserRepository userrepo;
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user=userrepo.findByEmail(email)
							.orElseThrow(()-> new RuntimeException("User not Found"));
		return user;
	}

}
