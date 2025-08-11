package com.ecommerce.app.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ecommerce.app.models.Category;

public interface CategoryRepository extends MongoRepository<Category, String> {
	// findAll, findById are inherited methods no need to write here

	Optional<Category> findByCategoryName(String categoryName);
}
