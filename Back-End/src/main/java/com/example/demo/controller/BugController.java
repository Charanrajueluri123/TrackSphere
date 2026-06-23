package com.example.demo.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.BugRequest;
import com.example.demo.dto.DashBoardResponse;
import com.example.demo.enums.BugStatus;
import com.example.demo.enums.Priority;
import com.example.demo.model.Bug;
import com.example.demo.service.BugService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bugs")
@RequiredArgsConstructor
public class BugController {
	private final BugService bugService;

	@PostMapping("/create")
	public Bug createBug(@RequestBody BugRequest req) {
		return bugService.createBug(req);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/{bugId}/assign/{developerId}")
	public Bug assignBug(@PathVariable int bugId, @PathVariable int developerId) {
		System.out.println("assigning bug");
		return bugService.assignBug(bugId, developerId);
	}
	
	@GetMapping("/dashboard")
	public DashBoardResponse dashboard() {
	    return bugService.getDashboard();
	}

	@PreAuthorize("hasRole('DEVELOPER')")
	@PutMapping("/{bugId}/status")
	public Bug updateStatus(@PathVariable int bugId, @RequestParam BugStatus status) {
		return bugService.updateStatus(bugId, status);
	}

	@GetMapping("/my-bugs")
	public List<Bug> myBugs() {
		return bugService.myAssignedBugs();
	}
	
	@GetMapping("/my-reported-bugs")
	public List<Bug> myReportedBugs(){
		return bugService.getMyReportedBugs();
	}
	
	@GetMapping("/getall")
	public List<Bug> getAllBugs() {
		return bugService.getAllBugs();
	}

	@GetMapping("/{bugId}")
	public Bug getBugById(@PathVariable int bugId) {
		return bugService.getBugById(bugId);
	}

	@GetMapping("/status")
	public List<Bug> findByStatus(@RequestParam BugStatus status) {
		return bugService.findByStatus(status);
	}

	@GetMapping("/priority")
	public List<Bug> getBugsByPriority(@RequestParam Priority priority) {
		return bugService.findByPriority(priority);
	}
	
	
}
