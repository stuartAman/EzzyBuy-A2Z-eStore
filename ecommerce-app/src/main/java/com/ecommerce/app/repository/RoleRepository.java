package com.ecommerce.app.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ecommerce.app.models.ERole;
import com.ecommerce.app.models.Role;

public interface RoleRepository extends MongoRepository<Role, String> {

	// finder method pattern
	Optional<Role> findByName(ERole name);
}
