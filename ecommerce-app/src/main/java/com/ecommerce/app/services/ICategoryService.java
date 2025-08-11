package com.ecommerce.app.services;

import java.util.List;

import com.ecommerce.app.models.Category;

public interface ICategoryService {

	List<Category> getAllCategories();

	Category getCategoryById(String categoryId);

	Category getCategoryByName(String categoryName);
}
