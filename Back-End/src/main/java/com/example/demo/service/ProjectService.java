package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.ProjectRequest;
import com.example.demo.model.Project;
import com.example.demo.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService{
	
	private final ProjectRepository projectrepo;
	
	public Project createProject(ProjectRequest req) {
		Project project=new Project();
		
		project.setName(req.getName());
		project.setDescription(req.getDescription());
		
		return projectrepo.save(project);
	}
	
	public List<Project> getAllProjects(){
		return projectrepo.findAll();
	}
	
	public Project getProjectById(int id) {
		return projectrepo.findById(id).orElseThrow(()-> new RuntimeException("Project Not Found"));
	}
	
	public void deleteById(int id) {
		projectrepo.deleteById(id);
	}
}
