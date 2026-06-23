package com.example.demo.dto;

import com.example.demo.enums.Priority;

import lombok.Data;

@Data
public class BugRequest {
	private String title;
	private String description;
	private Priority priority;
	private int projectId;
}
