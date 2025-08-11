package com.ecommerce.app.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
public class Address {
	@Id
	private Integer id;

	@Field(value = "type_address")
	@NotBlank
	private AddressType typeOfAddress;

	@NotBlank
	private String country;
	@Field
	@NotBlank
	private String state;
	@Field(value = "full_name")
	@NotBlank
	private String fullName;
	@Field(value = "mobile_number")
	@NotBlank
	@Size(min = 10, max = 10)
	private Long mobileNumber;
	@Field
	@NotBlank
	@Size(min = 6, max = 6)
	private Integer pincode;
	@NotBlank
	private String line1;

	private String line2;

	private String landmark;
	@NotBlank
	@Field(value = "town_city")
	private String townCity;

	public Address(@NotBlank AddressType typeOfAddress, @NotBlank String country, @NotBlank String state,
			@NotBlank String fullName, @NotBlank @Size(min = 10, max = 10) Long mobileNumber,
			@NotBlank @Size(min = 6, max = 6) Integer pincode, @NotBlank String line1, String line2, String landmark,
			@NotBlank String townCity) {
		super();
		this.typeOfAddress = typeOfAddress;
		this.country = country;
		this.state = state;
		this.fullName = fullName;
		this.mobileNumber = mobileNumber;
		this.pincode = pincode;
		this.line1 = line1;
		this.line2 = line2;
		this.landmark = landmark;
		this.townCity = townCity;
		this.id = this.hashCode();
	}

}