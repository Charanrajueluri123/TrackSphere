package com.example.demo.dto;

import lombok.Data;

@Data
public class CommentRequest {
	
	private int bugId;
	private String message;
}
