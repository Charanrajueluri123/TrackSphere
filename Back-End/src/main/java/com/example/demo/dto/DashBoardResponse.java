package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashBoardResponse {
	private long totalBugs;

	private long openBugs;

	private long inProgressBugs;

	private long resolvedBugs;

	private long closedBugs;
}
