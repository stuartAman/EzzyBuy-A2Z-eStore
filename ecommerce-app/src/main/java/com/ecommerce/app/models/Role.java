package com.ecommerce.app.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

//@Data annotation use to generates getters and setters for all fields.
@Data
//@Document annotation use to set the collection name that will be used by the model. If the collection doesn’t exist, MongoDB will create it.
@Document(collection = "roles")
public class Role {
	// Specify the MongoDB document’s primary key _id using the @Id annotation
	@Id
	private String id;

	private ERole name;

	// 0-arg constructor
	public Role() {

	}

	// parameterized constructor
	public Role(ERole name) {
		this.name = name;
	}
}
