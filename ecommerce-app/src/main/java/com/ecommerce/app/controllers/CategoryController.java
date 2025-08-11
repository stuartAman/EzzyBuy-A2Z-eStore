package com.ecommerce.app.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.app.models.Category;
import com.ecommerce.app.services.ICategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

	@Autowired
	private ICategoryService categoryService;

	@Value("${file.upload.location}/category")
	private String location;

	// List of categories
	@GetMapping("/all")
	public ResponseEntity<?> getAllCategory() {
		return new ResponseEntity<>(categoryService.getAllCategories(), HttpStatus.OK);
	}

	// Serve category image
	@GetMapping("/image/{categoryId}")
	public ResponseEntity<byte[]> getFile(@PathVariable String categoryId) throws IOException {
		// get category data
		Category category = categoryService.getCategoryById(categoryId);
		
		// Find image for category
		Path path = Paths.get(location, category.getImageName());
		byte[] imageData = Files.readAllBytes(path);


		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename=\"" + category.getImageName() + "\"")
				.body(imageData);
	}
}
