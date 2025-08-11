package com.ecommerce.app.dto.request;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class AddAddressRequest {

	@NotBlank
	private String typeOfAddress;
	@NotBlank
	private String country;
	@NotBlank
	private String state;
	@NotBlank
	private String fullName;
	@NotBlank
	private Long mobileNumber;
	@NotBlank
	private Integer pincode;
	@NotBlank
	private String line1;

	private String line2;
	@NotBlank
	private String landmark;
	@NotBlank
	private String townCity;
}
