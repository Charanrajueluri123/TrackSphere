package com.example.demo.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AdminDashboardResponse;
import com.example.demo.dto.DeveloperDashboardResponse;
import com.example.demo.dto.TesterDashboardResponse;
import com.example.demo.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
	
	private final DashboardService dashboardService;
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/admin")
	public AdminDashboardResponse getAdminDashboard() {
		return dashboardService.getAdminDashboard();
	}
	
	@PreAuthorize("hasRole('DEVELOPER')")
	@GetMapping("/developer")
	public DeveloperDashboardResponse getDeveloperDashboard() {
		return dashboardService.getDeveloperDashboard();
	}
	
	@PreAuthorize("hasRole('TESTER')")
	@GetMapping("/tester")
	public TesterDashboardResponse getTesterDashboard() {
		return dashboardService.getTesterDashboard();
	}
}
