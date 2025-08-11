package com.ecommerce.app.dto.request;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class LoginRequest {

	@NotBlank
	private String email;

	@NotBlank
	private String password;

	private Boolean isRemembered = false;
}
