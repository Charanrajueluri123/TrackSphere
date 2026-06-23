package com.example.demo.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.BugRequest;
import com.example.demo.dto.DashBoardResponse;
import com.example.demo.enums.BugStatus;
import com.example.demo.enums.Priority;
import com.example.demo.enums.Role;
import com.example.demo.model.Bug;
import com.example.demo.model.Project;
import com.example.demo.model.User;
import com.example.demo.repository.BugRepository;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BugService {

	private final UserRepository userRepo;

	private final ProjectRepository projectRepo;

	private final BugRepository bugrepo;

	private User getCurrentUser() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		System.out.println("email:" + email);
		return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not Found"));
	}

	public Bug createBug(BugRequest req) {
		Project project = projectRepo.findById(req.getProjectId())
				.orElseThrow(() -> new RuntimeException("Project Not Found"));
		User currentUser = getCurrentUser();

		Bug bug = new Bug();
		bug.setTitle(req.getTitle());
		bug.setDescription(req.getDescription());
		bug.setPriority(req.getPriority());
		bug.setStatus(BugStatus.OPEN);
		bug.setProject(project);
		bug.setCreatedBy(currentUser);

		return bugrepo.save(bug);
	}

	public Bug assignBug(int bugId, int developerId) {
		Bug bug = bugrepo.findById(bugId).orElseThrow(() -> new RuntimeException("Bug Not Found"));
		User developer = userRepo.findById(developerId).orElseThrow(() -> new RuntimeException("User Not Found"));

		if (developer.getRole() != Role.DEVELOPER) {
			throw new RuntimeException("Only Developers can be assigned bugs");
		}

		bug.setAssignedTo(developer);

		return bugrepo.save(bug);
	}

	public Bug updateStatus(int bugId, BugStatus status) {
		Bug bug = bugrepo.findById(bugId).orElseThrow(() -> new RuntimeException("Bug Not Found"));
//		transiotoin valiadtions

		User currentUser = getCurrentUser();

//		if (bug.getAssignedTo() == null || ()!bug.getAssignedTo().getId()==(currentUser.getId())) {
//
//			throw new RuntimeException("You are not assigned to this bug");
//		}

		if (!isValidTransition(bug.getStatus(), status)) {
			throw new RuntimeException("Invalid Status Transition");
		}
		bug.setStatus(status);

		return bugrepo.save(bug);
	}

//	 validation for transitions control
	private boolean isValidTransition(BugStatus current, BugStatus next) {
		return switch (current) {
		case OPEN -> next == BugStatus.IN_PROGRESS;
		case IN_PROGRESS -> next == BugStatus.RESOLVED;
		case RESOLVED -> next == BugStatus.CLOSED;
		default -> false;
		};
	}

	public List<Bug> myAssignedBugs() {
		User currentUser = getCurrentUser();
		return bugrepo.findByAssignedTo(currentUser);
	}

	public List<Bug> getAllBugs() {
		return bugrepo.findAll();
	}

	public Bug getBugById(int id) {
		return bugrepo.findById(id).orElseThrow(() -> new RuntimeException("Bug Not Found"));
	}

	public List<Bug> findByStatus(BugStatus status) {
		return bugrepo.findByStatus(status);
	}

	public List<Bug> findByPriority(Priority priority) {
		// TODO Auto-generated method stub
		return bugrepo.findByPriority(priority);
	}

	public DashBoardResponse getDashboard() {
		return new DashBoardResponse(bugrepo.count(), bugrepo.countByStatus(BugStatus.OPEN),
				bugrepo.countByStatus(BugStatus.IN_PROGRESS), bugrepo.countByStatus(BugStatus.RESOLVED),
				bugrepo.countByStatus(BugStatus.CLOSED));
	}

	public List<Bug> getMyReportedBugs() {
		User currentUser=getCurrentUser();
		return bugrepo.findByCreatedBy(currentUser);
	}

	
}
