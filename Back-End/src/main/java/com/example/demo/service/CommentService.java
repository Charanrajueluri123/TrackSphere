package com.example.demo.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CommentRequest;
import com.example.demo.model.Bug;
import com.example.demo.model.Comment;
import com.example.demo.model.User;
import com.example.demo.repository.BugRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository commentRepo;
	private final BugRepository bugRepo;
	private final UserRepository userRepo;

	private User getCurrentUser() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		System.out.println("email:" + email);
		return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not Found"));
	}

	public Comment addComment(CommentRequest req) {
		Bug bug = bugRepo.findById(req.getBugId()).orElseThrow(() -> new RuntimeException("Bug Not Found"));

		User currentUser = getCurrentUser();
		Comment comment = new Comment();
		comment.setMessage(req.getMessage());
		comment.setBug(bug);
		comment.setUser(currentUser);

		return commentRepo.save(comment);
	}

	public List<Comment> getCommentsByBug(int bugId) {
		return commentRepo.findByBugId(bugId);
	}
}
