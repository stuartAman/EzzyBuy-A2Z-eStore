package com.ecommerce.app.dto.response;

import lombok.Data;

@Data
public class ProfileResponse {

	private String id;

	private String firstname;

	private String lastname;

	private String email;

	public ProfileResponse(String id, String firstname, String lastname, String email) {
		super();
		this.id = id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
	}

}
