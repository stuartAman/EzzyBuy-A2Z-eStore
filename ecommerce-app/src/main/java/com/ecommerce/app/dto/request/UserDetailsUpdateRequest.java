package com.ecommerce.app.dto.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class UserDetailsUpdateRequest {

	@NotBlank
	@Size(min = 3, max = 20)
	private String firstname;

	@NotBlank
	@Size(min = 3, max = 20)
	private String lastname;

}
