package com.ecommerce.app.dto.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class PasswordChangeRequest {
	@NotBlank
	@Size(min = 6, max = 40)
	private String oldPassword;

	@NotBlank
	@Size(min = 6, max = 40)
	private String newPassword;
}
