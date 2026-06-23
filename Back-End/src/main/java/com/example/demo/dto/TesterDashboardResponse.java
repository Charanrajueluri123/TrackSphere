package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TesterDashboardResponse {
	private long reportedBugs;
	private long openReports;
	private long inProgressReports;
	private long resolvedReports;
	private long closedReports;
}
