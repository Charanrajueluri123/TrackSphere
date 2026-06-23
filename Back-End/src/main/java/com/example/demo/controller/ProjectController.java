package com.example.demo.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ProjectRequest;
import com.example.demo.model.Project;
import com.example.demo.service.ProjectService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api/projects")
@RestController
@RequiredArgsConstructor
public class ProjectController {
	private final ProjectService projectService;

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/create")
	public Project createProject(@RequestBody ProjectRequest req) {
		return projectService.createProject(req);
	}

	@GetMapping("/getall")
	public List<Project> getAllProjects() {
		return projectService.getAllProjects();
	}

	@GetMapping("/{id}")
	public Project getProjectById(@PathVariable int id) {
		return projectService.getProjectById(id);
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{id}")
	public String deleteProject(@PathVariable int id) {
		projectService.deleteById(id);
		return "Project Deleted";
	}
}
