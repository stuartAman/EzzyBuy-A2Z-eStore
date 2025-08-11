package com.ecommerce.app.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.app.models.Category;
import com.ecommerce.app.repository.CategoryRepository;

@Service
@Transactional
public class CategoryServiceImplementation implements ICategoryService {

	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public List<Category> getAllCategories() {
		return categoryRepository.findAll();
	}

	@Override
	public Category getCategoryById(String categoryId) {
		return categoryRepository.findById(categoryId)
				.orElseThrow(() -> new RuntimeException("Category by ID " + categoryId + " not found!!!!"));
	}

	@Override
	public Category getCategoryByName(String categoryName) {

		return categoryRepository.findByCategoryName(categoryName)
				.orElseThrow(() -> new RuntimeException("Category by Name " + categoryName + " not found!!!!"));
	}
}
