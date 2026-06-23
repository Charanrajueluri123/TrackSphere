package com.example.demo.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AdminDashboardResponse;
import com.example.demo.dto.DeveloperDashboardResponse;
import com.example.demo.dto.TesterDashboardResponse;
import com.example.demo.enums.BugStatus;
import com.example.demo.enums.Role;
import com.example.demo.model.User;
import com.example.demo.repository.BugRepository;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {
	
	private final BugRepository bugRepository;
	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;
	
	private User getCurrentUser() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not Found"));
	}
	
	public AdminDashboardResponse getAdminDashboard() {
		return AdminDashboardResponse.builder()
			.totalProjects(projectRepository.count())
			.totalBugs(bugRepository.count())
			.openBugs(bugRepository.countByStatus(BugStatus.OPEN))
			.inProgressBugs(bugRepository.countByStatus(BugStatus.IN_PROGRESS))
			.resolvedBugs(bugRepository.countByStatus(BugStatus.RESOLVED))
			.closedBugs(bugRepository.countByStatus(BugStatus.CLOSED))
			.totalDevelopers(userRepository.countByRole(Role.DEVELOPER))
			.totalTesters(userRepository.countByRole(Role.TESTER))
			.build();
	}
	
	public DeveloperDashboardResponse getDeveloperDashboard() {
		User developer = getCurrentUser();
		return DeveloperDashboardResponse.builder()
			.assignedBugs(bugRepository.countByAssignedTo(developer))
			.openTasks(bugRepository.countByAssignedToAndStatus(developer, BugStatus.OPEN))
			.inProgressTasks(bugRepository.countByAssignedToAndStatus(developer, BugStatus.IN_PROGRESS))
			.resolvedTasks(bugRepository.countByAssignedToAndStatus(developer, BugStatus.RESOLVED))
			.closedTasks(bugRepository.countByAssignedToAndStatus(developer, BugStatus.CLOSED))
			.build();
	}
	
	public TesterDashboardResponse getTesterDashboard() {
		User tester = getCurrentUser();
		return TesterDashboardResponse.builder()
			.reportedBugs(bugRepository.countByCreatedBy(tester))
			.openReports(bugRepository.countByCreatedByAndStatus(tester, BugStatus.OPEN))
			.inProgressReports(bugRepository.countByCreatedByAndStatus(tester, BugStatus.IN_PROGRESS))
			.resolvedReports(bugRepository.countByCreatedByAndStatus(tester, BugStatus.RESOLVED))
			.closedReports(bugRepository.countByCreatedByAndStatus(tester, BugStatus.CLOSED))
			.build();
	}
}
