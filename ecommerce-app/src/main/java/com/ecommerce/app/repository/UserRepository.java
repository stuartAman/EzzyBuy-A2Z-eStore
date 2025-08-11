package com.ecommerce.app.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ecommerce.app.models.User;

public interface UserRepository extends MongoRepository<User, String> {

	// finder method pattern
	Optional<User> findByEmail(String email);

	// check user is existed or not
	Boolean existsByEmail(String email);
}
