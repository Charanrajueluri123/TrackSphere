package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CommentRequest;
import com.example.demo.model.Comment;
import com.example.demo.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
	
	private final CommentService commentService;
	
	@PostMapping("/add")
	public Comment addComment(@RequestBody CommentRequest req) {
		return commentService.addComment(req);
	}
	
	@GetMapping("/{bugId}")
	public List<Comment> getComments(@PathVariable int bugId){
		return commentService.getCommentsByBug(bugId);
	}
}
