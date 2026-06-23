package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.DeveloperResponse;
import com.example.demo.enums.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<DeveloperResponse> getAllDevelopers() {

        List<User> developers = userRepository.findByRole(Role.DEVELOPER);

        List<DeveloperResponse> responseList = new ArrayList<>();

        for (User user : developers) {
            DeveloperResponse response = new DeveloperResponse();
            response.setId(user.getId());
            response.setName(user.getName());

            responseList.add(response);
        }

        return responseList;
    }
}