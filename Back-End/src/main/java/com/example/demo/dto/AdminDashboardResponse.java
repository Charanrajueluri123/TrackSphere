package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {
	private long totalProjects;
	private long totalBugs;
	private long openBugs;
	private long inProgressBugs;
	private long resolvedBugs;
	private long closedBugs;
	private long totalDevelopers;
	private long totalTesters;
}
