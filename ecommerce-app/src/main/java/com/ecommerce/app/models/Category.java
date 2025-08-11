package com.ecommerce.app.models;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data // @Data annotation use to generates getters and setters for all fields.
@Document(collection = "categories") // @Document annotation use to set the collection name that will be used by the
										// model. If the collection doesn’t exist, MongoDB will create it.
public class Category {
	@Id // Specify the MongoDB document’s primary key _id using the @Id annotation
	private String id;
	@NotBlank // Validates that the property is not null or whitespace. But, it can be applied
				// only to text values.
	@Size(max = 20) // Indicates that the property should have a minimum of two characters and
					// maximum is given by max attribute.
	private String categoryName;
	@NotBlank
	private String imageName;

	private List<String> subCategory;

	public Category(String categoryName) {
		this.categoryName = categoryName;
	}

}
