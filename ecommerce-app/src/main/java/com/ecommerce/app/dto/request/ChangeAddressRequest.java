package com.ecommerce.app.dto.request;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class ChangeAddressRequest {

	@NotBlank
	private Integer addressId;
}
