package com.ecommerce.app.dto.request;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class MakeAdminRequest {
	@NotBlank
	private String email;
}
