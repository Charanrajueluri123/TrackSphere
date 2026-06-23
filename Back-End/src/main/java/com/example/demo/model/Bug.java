package com.example.demo.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.demo.enums.BugStatus;
import com.example.demo.enums.Priority;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bug {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	private String title;
	private String description;
	
	@Enumerated(EnumType.STRING)
	private Priority priority;
	
	@Enumerated(EnumType.STRING)
	private BugStatus status;
	
	@ManyToOne
	@JoinColumn(name="project_id")
	private Project project;
	
	@ManyToOne
	@JoinColumn(name="created_by")
	private User createdBy;
	
	@ManyToOne
	@JoinColumn(name="assigned_to")
	private User assignedTo;
	
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	@UpdateTimestamp
	private LocalDateTime updatedAt;
	
}
