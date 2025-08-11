package com.ecommerce.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.app.dto.response.ProfileResponse;
import com.ecommerce.app.models.User;
import com.ecommerce.app.repository.UserRepository;

@Service
@Transactional
public class UserServiceImplementation implements IUserService {

	@Autowired
	UserRepository userRepository;

	@Override
	public User getById(String userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User by ID " + userId + " not found!!!!"));
	}

	@Override
	public User getByEmail(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User by Email " + email + " not found!!!!"));
	}

	@Override
	public User saveUser(User user) {
		return userRepository.save(user);
	}

	@Override
	public ProfileResponse getProfile(User user) {

		return new ProfileResponse(user.getId(), user.getFirstname(), user.getLastname(), user.getEmail());
	}

}
