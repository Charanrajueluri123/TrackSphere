package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeveloperDashboardResponse {
	private long assignedBugs;
	private long openTasks;
	private long inProgressTasks;
	private long resolvedTasks;
	private long closedTasks;
}
