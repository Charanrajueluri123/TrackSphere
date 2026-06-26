package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.demo.model.Bug;
import com.example.demo.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String sender;

    public void sendBugAssignedMail(User developer, Bug bug) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(sender);
        mail.setTo(developer.getEmail());
          mail.setSubject("🐞 New Bug Assigned - TrackSphere");

        mail.setText(
                "Hello " + developer.getName() + ",\n\n"
                        + "A new bug has been assigned to you.\n\n"
                        + "Title : " + bug.getTitle() + "\n"
                        + "Description : " + bug.getDescription() + "\n"
                        + "Priority : " + bug.getPriority() + "\n"
                        + "Status : " + bug.getStatus() + "\n\n"
                        + "Please login to TrackSphere to work on it.\n\n"
                        + "Regards,\n"
                        + "TrackSphere");

        mailSender.send(mail);
    }
}
