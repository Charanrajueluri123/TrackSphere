package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.enums.BugStatus;
import com.example.demo.enums.Priority;
import com.example.demo.model.Bug;
import com.example.demo.model.User;

@Repository
public interface BugRepository extends JpaRepository<Bug, Integer> {
	List<Bug> findByAssignedTo(User user);
	List<Bug> findByStatus(BugStatus status);
	List<Bug> findByPriority(Priority priority);
	List<Bug> findByCreatedBy(User user);
	long countByStatus(BugStatus status);
	long countByAssignedTo(User user);
	long countByAssignedToAndStatus(User user, BugStatus status);
	long countByCreatedBy(User user);
	long countByCreatedByAndStatus(User user, BugStatus status);
}
