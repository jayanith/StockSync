package com.inventory.service;

import com.inventory.model.User;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User createUser(Map<String, Object> userData) {
        if (userRepository.existsByEmail((String) userData.get("email"))) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .name((String) userData.get("name"))
                .email((String) userData.get("email"))
                .password(passwordEncoder.encode((String) userData.get("password")))
                .role(userData.get("role") != null ? (String) userData.get("role") : "Customer")
                .status("Active")
                .build();

        return userRepository.save(user);
    }

    public User updateUser(Long id, Map<String, Object> userData) {
        User user = getUserById(id);
        if (userData.containsKey("name")) user.setName((String) userData.get("name"));
        if (userData.containsKey("email")) user.setEmail((String) userData.get("email"));
        if (userData.containsKey("role")) user.setRole((String) userData.get("role"));
        if (userData.containsKey("status")) user.setStatus((String) userData.get("status"));
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updatePassword(Long id, String currentPassword, String newPassword) {
        User user = getUserById(id);
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }
}
