package com.rentmenow.service;

import com.rentmenow.dto.UserDto;
import com.rentmenow.dto.RegisterRequest;
import com.rentmenow.entity.User;
import com.rentmenow.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public UserDto createUser(RegisterRequest request) {
		if (userRepository.existsByUsername(request.getUsername())) {
			throw new RuntimeException("Username already exists");
		}
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new RuntimeException("Email already exists");
		}

		User user = new User();
		user.setUsername(request.getUsername());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setEmail(request.getEmail());
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setPhone(request.getPhone());
		user.setRole("USER");

		User savedUser = userRepository.save(user);
		return convertToDto(savedUser);
	}

	public List<UserDto> getAllUsers() {
		return userRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
	}

	public UserDto getUserById(Long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
		return convertToDto(user);
	}

	public UserDto getUserByUsername(String username) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
		return convertToDto(user);
	}

	public UserDto updateUser(Long id, UserDto userDto) {
		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		user.setEmail(userDto.getEmail());
		user.setFirstName(userDto.getFirstName());
		user.setLastName(userDto.getLastName());
		user.setPhone(userDto.getPhone());
		user.setBio(userDto.getBio());

		User savedUser = userRepository.save(user);
		return convertToDto(savedUser);
	}

	public void deleteUser(Long id) {
		if (!userRepository.existsById(id)) {
			throw new RuntimeException("User not found");
		}
		userRepository.deleteById(id);
	}

	public User findByUsername(String username) {
		return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
	}

	private UserDto convertToDto(User user) {
		return new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.getFirstName(),
				user.getLastName(), user.getPhone(), user.getBio());
	}
}