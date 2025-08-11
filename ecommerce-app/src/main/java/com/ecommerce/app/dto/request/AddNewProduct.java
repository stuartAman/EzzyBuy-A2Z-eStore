package com.ecommerce.app.dto.request;

import java.util.Map;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class AddNewProduct {
	@NotBlank
	@Size(max = 100)
	private String name;
	@NotBlank
	private String description;
	@NotBlank
	private Double price;
	@NotBlank
	private Integer stock;
	@NotBlank
	private String subCategoryName;
	@NotBlank
	private Map<String, String> additionalDetails;
}